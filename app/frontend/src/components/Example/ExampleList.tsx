// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    { text: "What is the process to allocate a hearing from the unallocated hearing list", value: "What is the process to allocate a hearing from the unallocated hearing list" },
    { text: "What code do I use for a case involving murder and sent to the Crown court for bail", value: "What code do I use for a case involving murder and sent to the Crown court for bail" },
    { text: "What is the offence code for Application to review Bail decision", value: "What is the offence code for Application to review Bail decision" }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
