// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from "react";
import { Text } from "@fluentui/react";
import { Label } from '@fluentui/react/lib/Label';
import { Separator } from '@fluentui/react/lib/Separator';
import { getInfoData, GetInfoResponse, UserFeedback, GetWhoAmIResponse  } from "../../api";
import appVersionInfo from '../../../version.json';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import classNames from "classnames";
import styles from "./FeedbackContent.module.css";

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 200 } };

const dropdownAccuracyOptions = [
    { key: 'Accuracy', text: 'Accuracy', itemType: DropdownMenuItemType.Header },
    { key: '5', text: 'Extremely confident' },
    { key: '4', text: 'Very confident' },
    { key: '3', text: 'Moderately confident' },
    { key: '2', text: 'Not very confident' },
    { key: '1', text: 'Not confident at all' },
  ];

const dropdownEaseOfUseOptions = [
    { key: 'EaseOfUse', text: 'Ease Of Use', itemType: DropdownMenuItemType.Header },
    { key: '5', text: 'Extremely easy' },
    { key: '4', text: 'Very easy' },
    { key: '3', text: 'Moderately easy' },
    { key: '2', text: 'Not very easy' },
    { key: '1', text: 'Not easy at all' },
  ];

const dropdownResponseTimeOptions = [
    { key: 'ResponseTime', text: 'Response Time', itemType: DropdownMenuItemType.Header },
    { key: '5', text: 'Extremely satisfied' },
    { key: '4', text: 'Very satisfied' },
    { key: '3', text: 'Moderately satisfied' },
    { key: '2', text: 'Not very satisfied' },
    { key: '1', text: 'Not satisfied at all' },
  ];

const dropdownHelpfulOptions = [
    { key: 'Helpful', text: 'Helpful', itemType: DropdownMenuItemType.Header },
    { key: '5', text: 'Extremely helpful' },
    { key: '4', text: 'Very helpful' },
    { key: '3', text: 'Moderately helpful' },
    { key: '2', text: 'Not very helpful' },
    { key: '1', text: 'Not helpful at all' },
  ];

const dropdownReusabilityOptions = [
    { key: 'Reusability', text: '(Re)usability', itemType: DropdownMenuItemType.Header },
    { key: '5', text: 'Extremely likely' },
    { key: '4', text: 'Very likely' },
    { key: '3', text: 'Somewhat likely' },
    { key: '2', text: 'Not so likely' },
    { key: '1', text: 'Not likely at all' },
  ];

interface Props {
    className?: string;
    whoAmIData: GetWhoAmIResponse | undefined;
    onUserFeedback: (feedbackData : UserFeedback | undefined) => void;
}

export const FeedbackContent = ({ className, whoAmIData, onUserFeedback }: Props) => {
    const [selectedAccuracyItem, setSelectedAccuracyItem] = useState<IDropdownOption>();
    const [selectedEaseOfuseItem, setSelectedEaseOfuseItem] = useState<IDropdownOption>();
    const [selectedResponseTimeItem, setSelectedResponseTimeItem] = useState<IDropdownOption>();
    const [selectedHelpfulItem, setSelectedHelpfulItem] = useState<IDropdownOption>();
    const [selectedReusabilityItem, setSelectedReusabilityItem] = useState<IDropdownOption>();

    const onAccuracyChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedAccuracyItem(item);
    };

    const onEaseOfuseChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedEaseOfuseItem(item);
    };

    const onResponseTimeChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedResponseTimeItem(item);
    };

    const onHelpfulChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedHelpfulItem(item);
    };

    const onReusabilityChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedReusabilityItem(item);
    };

    useEffect(() => {
        //fetchInfoData();
    }, []);

    // execute the feedback button
    const handleFeedback = (async () => {
      if(!selectedAccuracyItem?.text) {
        alert("Please select a response for the Accuracy Question");
        return
      }
      if(!selectedEaseOfuseItem?.text) {
        alert("Please select a response for the Ease of Use Question");
        return
      }
      if(!selectedResponseTimeItem?.text) {
        alert("Please select a response for the Response Time Question");
        return
      }
      if(!selectedHelpfulItem?.text) {
        alert("Please select a response for the Helpful Question");
        return
      }
      if(!selectedReusabilityItem?.text) {
        alert("Please select a response for the Reusability Question");
        return
      }
      const userFeedbackData: UserFeedback = ({
        USER_ID: whoAmIData?.USER_ID, 
        ACCURACY: selectedAccuracyItem?.text, 
        EASE_OF_USE: selectedEaseOfuseItem?.text, 
        RESPONSE_TIME: selectedResponseTimeItem?.text, 
        HELPFUL: selectedHelpfulItem?.text,
        REUSABILITY: selectedReusabilityItem?.text,
        TIMESTAMP: new Date().toISOString()
      })
      onUserFeedback(userFeedbackData);
    });

    return (
        <div>
            <Separator>Accuracy</Separator>
            <Dropdown
                label="How confident are you the answer given by Knowledge Genie will assist you with your task?"
                onChange={onAccuracyChange}
                placeholder="Select a value"
                options={dropdownAccuracyOptions}
                styles={dropdownStyles}
                aria-label="Accuracy Options"
                required
            />
            <Separator>Ease of use</Separator>
            <Dropdown
                label="How easy was it to interact with the Knowledge Genie?"
                onChange={onEaseOfuseChange}
                placeholder="Select a value"
                options={dropdownEaseOfUseOptions}
                styles={dropdownStyles}
                aria-label="Ease Of Use Options"
                required
            />
            <Separator>Response Time</Separator>
            <Dropdown
                label="How satisfied are you with the speed of the Knowledge Genie's responses?"
                onChange={onResponseTimeChange}
                placeholder="Select a value"
                options={dropdownResponseTimeOptions}
                styles={dropdownStyles}
                aria-label="Response Time Options"
                required
            />
            <Separator>Helpful</Separator>
            <Dropdown
                label="How helpful was the Knowledge Genie to find the information needed to complete the task?"
                onChange={onHelpfulChange}
                placeholder="Select a value"
                options={dropdownHelpfulOptions}
                styles={dropdownStyles}
                aria-label="Helpful Options"
                required
            />
            <Separator>Re(usability)</Separator>
            <Dropdown
                label="How likely are you to use the Knowledge Genie again for searching information?"
                onChange={onReusabilityChange}
                placeholder="Select a value"
                options={dropdownReusabilityOptions}
                styles={dropdownStyles}
                aria-label="Reusability Options"
                required
            />
            <br /><br />
            <button
              onClick={handleFeedback}
              className={classNames(
                styles.upload_button,
                ""
              )}
              aria-label="Submit Feedback"
            >
              Submit Feedback
            </button>            
        </div>
    );
};