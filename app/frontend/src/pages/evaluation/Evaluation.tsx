// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState } from 'react';
import { Pivot,
    PivotItem } from "@fluentui/react";
import { ITag } from '@fluentui/react/lib/Pickers';
import { FileStatus } from "../../components/FileStatus/FileStatus";
import styles from "./Evaluation.module.css";
import { EvaluateFeedback } from '../../components/EvaluateFeedback';
import { EvaluateAccuracy } from '../../components/EvaluateAccuracy';

export interface IButtonExampleProps {
    disabled?: boolean;
    checked?: boolean;
  }

const Evaluation = () => {
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

    const handleLinkClick = (item?: PivotItem) => {
        setSelectedKey(undefined);
    };    

    return (
        <div className={styles.contentArea} >
            <Pivot aria-label="Upload Files Section" className={styles.topPivot} onLinkClick={handleLinkClick}>
                <PivotItem headerText="Feedback" aria-label="Feedback Tab">
                    <EvaluateFeedback className=""/>
                </PivotItem>
                <PivotItem headerText="Accuracy" aria-label="Accuracy Tab">
                    <EvaluateAccuracy className=""/>
                </PivotItem>
            </Pivot>
        </div>
    );
};
    
export default Evaluation;