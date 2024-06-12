# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

""" Library of code for status logs reused across various calling features """
import os
from datetime import datetime, timedelta
import logging
from azure.cosmos import CosmosClient, PartitionKey, exceptions
import traceback, sys

class UserFeedbackLog:
    """ Class for logging User Feedback to Cosmos DB"""

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

    def upsert_document(self, user, accuracy, ease_of_use, response_time, helpful, reusability, timestamp):
        """ Function to upsert a user feedback for a specified id """

        # add to standard logger
        logging.info("%s Start - %s", user, timestamp)

        json_document = ""
        try:
            json_document = {
                "id": user + " " + timestamp,
                "user": user,
                "accuracy": accuracy,
                "ease_of_use": ease_of_use,
                "response_time": response_time,
                "helpful": helpful,
                "reusability": reusability,
                "timestamp": timestamp
            }
            self.container.upsert_item(body=json_document)

        except Exception as err:
            # log the exception with stack trace to the status log
            logging.error("Unexpected exception upserting document %s", str(err))

    def read_feedback_by_timeframe(self,
                       within_n_hours: int,
                       ):
        """ 
        Function to issue a query and return resulting feedback          
        args
            within_n_hours - integer representing from how many minutes ago to return docs for
        """

        query_string = "SELECT c.id,  c.user, c.timestamp, \
            c.accuracy, c.ease_of_use, c.response_time, c.helpful, \
            c.reusability FROM c"

        conditions = []    
        if within_n_hours != -1:
            from_time = datetime.utcnow() - timedelta(hours=within_n_hours)
            from_time_string = str(from_time.strftime('%Y-%m-%d %H:%M:%S'))
            conditions.append(f"c.timestamp > '{from_time_string}'")

        if conditions:
            query_string += " WHERE " + " AND ".join(conditions)

        query_string += " ORDER BY c.timestamp DESC"

        items = list(self.container.query_items(
            query=query_string,
            enable_cross_partition_query=True
        ))

        return items
