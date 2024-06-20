// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMode } from "../../api/models";
import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const CJSEXAMPLES: ExampleModel[] = [
    { text: "What is the Offence Code for Offence Title \"Assault by beating\"", value: "What is the Offence Code for Offence Title \"Assault by beating\"" },
    { text: "List 7 Offence Codes and Offence Titles related to Legislation \"Theft Act 1968.\"", value: "List 7 Offence Codes and Offence Titles related to Legislation \"Theft Act 1968.\"" },
    { text: "Show me the DVLA Code for \"Use a motor vehicle on a road / public place without third party insurance\"", value: "Show me the DVLA Code for \"Use a motor vehicle on a road / public place without third party insurance\"" }
];

const EXAMPLES: ExampleModel[] = [
    { text: "What is the process to allocate a hearing from the unallocated hearing list", value: "What is the process to allocate a hearing from the unallocated hearing list" },
    { text: "What code do I use for a case involving murder and sent to the Crown court for bail", value: "What code do I use for a case involving murder and sent to the Crown court for bail" },
    { text: "What is the offence code for Application to review Bail decision", value: "What is the offence code for Application to review Bail decision" }
];

interface Props {
    onExampleClicked: (value: string) => void;
    activeChatMode: ChatMode
}

export const ExampleList = ({ onExampleClicked, activeChatMode }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {activeChatMode == ChatMode.TabularDataAssistant && CJSEXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
            {activeChatMode == ChatMode.WorkOnly && EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
