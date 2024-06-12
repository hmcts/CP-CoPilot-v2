// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Text } from "@fluentui/react";
import { PersonFeedback24Regular } from "@fluentui/react-icons";

import styles from "./FeedbackButton.module.css";

interface Props {
    className?: string;
    onClick: () => void;
}

export const FeedbackButton = ({ className, onClick }: Props) => {
    return (
        <div className={`${styles.container} ${className ?? ""}`} onClick={onClick}>
            <PersonFeedback24Regular />
            <Text>{"Feedback"}</Text>
        </div>
    );
};
