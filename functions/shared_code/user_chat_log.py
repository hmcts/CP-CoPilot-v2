# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

""" Library of code for status logs reused across various calling features """
from enum import Enum
import os
from datetime import datetime, timedelta
import logging
from azure.cosmos import CosmosClient, PartitionKey, exceptions
import traceback, sys

class AccuracyState(Enum):
    """ Enum for state of a chat """
    UNEVALUATED = "Unevaluated"
    CORRECT = "Correct"
    INCORRECT = "Incorrect"
    PARTIAL = "Partial"
    ALL = "All"

class UserChatLog:
    """ Class for logging User Chats to Cosmos DB"""

    def __init__(self, url, key, database_name, container_name):
        """ Constructor function """
        self._url = url
        self._key = key
        self._database_name = database_name
        self._container_name = container_name
        self.cosmos_client = CosmosClient(url=self._url, credential=self._key)

        # Select a database (will create it if it doesn't exist)
        self.database = self.cosmos_client.get_database_client(self._database_name)
        if self._database_name not in [db['id'] for db in self.cosmos_client.list_databases()]:
            self.database = self.cosmos_client.create_database(self._database_name)

        # Select a container (will create it if it doesn't exist)
        self.container = self.database.get_container_client(self._container_name)
        if self._container_name not in [container['id'] for container
                                        in self.database.list_containers()]:
            self.container = self.database.create_container(id=self._container_name,
                partition_key=PartitionKey(path="/file_name"))

    def upsert_document(self, user, prompt, start_time, response, citations, end_time):
        """ Function to upsert a user chat interaction for a specified id """

        # add to standard logger
        logging.info("%s Start - %s", user, start_time)

        json_document = ""
        try:
            json_document = {
                "id": user + " " + start_time,
                "user": user,
                "prompt": prompt,
                "start_time": start_time,
                "response": response,
                "citations": citations,
                "end_time": end_time,
                "type": "chat",
                "state": str(AccuracyState.UNEVALUATED.value),
                "review_comment": ""
            }
            self.container.upsert_item(body=json_document)

        except Exception as err:
            # log the exception with stack trace to the status log
            logging.error("Unexpected exception upserting document %s", str(err))

    def read_chat_interactions_by_timeframe(self,
                       within_n_hours: int,
                       state: str = 'All',
                       user: str = ''
                       ):
        """ 
        Function to issue a query and return resulting chat interactions          
        args
            within_n_hours - integer representing from how many minutes ago to return docs for
        """

        query_string = "SELECT c.id,  c.user, c.prompt, \
            c.response, c.start_time, c.end_time, c.citations, \
            c.state, c.review_comment, c.type FROM c"

        conditions = []

        conditions.append("c.type = 'chat'")

        if within_n_hours != -1:
            from_time = datetime.utcnow() - timedelta(hours=within_n_hours)
            from_time_string = str(from_time.strftime('%Y-%m-%d %H:%M:%S'))
            conditions.append(f"c.start_time > '{from_time_string}'")

        if state != 'All':
            conditions.append(f"c.state = '{state}'")

        if user != '':
            conditions.append(f"STARTSWITH(LOWER(c.user), '{user.lower()}')")

        if conditions:
            query_string += " WHERE " + " AND ".join(conditions)

        query_string += " ORDER BY c.start_time DESC"

        items = list(self.container.query_items(
            query=query_string,
            enable_cross_partition_query=True
        ))

        return items

    def review_comment(self, log_id: str, state: str, review_comment: str):
        """ Function to update the review comment for a specified id """

        # add to standard logger
        logging.info("%s Start - %s", log_id, state)

        try:
            response = self.container.read_item(item=log_id, partition_key=log_id)
            json_document = response.get('resource')

            # Check if the document is found
            if json_document:
                json_document['state'] = state
                json_document['review_comment'] = review_comment
                self.container.replace_item(item=json_document['id'], body=json_document)
            else:
                logging.error("Document with id %s not found. State=%s; ReviewComment=%s", log_id, state, review_comment)

        except Exception as err:
            # log the exception with stack trace to the status log
            logging.error("Unexpected exception review_comment %s", str(err))

    def log_event(self, user: str, typ: str, comment: str, timestamp: str):
        """ Function to upsert a user generic log for a specified id """

        # add to standard logger
        logging.info("%s Start - %s", user, timestamp)

        try:
            # Ensure that all parameters are strings to avoid concatenation errors
            user = str(user) if user is not None else ""
            typ = str(typ) if typ is not None else ""
            comment = str(comment) if comment is not None else ""
            timestamp = str(timestamp) if timestamp is not None else ""

            json_document = {
                "id": user + " " + timestamp,
                "user": user,
                "type": typ,
                "comment": comment,
                "timestamp": timestamp
            }
            self.container.upsert_item(body=json_document)

        except Exception as err:
            # log the exception with stack trace to the status log
            logging.error("Unexpected exception log_event %s user=%s; typ=%s; comment=%s; timestamp=%s", str(err), user, typ, comment, timestamp)

