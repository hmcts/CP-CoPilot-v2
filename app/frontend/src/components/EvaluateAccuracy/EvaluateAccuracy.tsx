// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { DefaultButton, DetailsList, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IColumn, ITextField, ITextFieldStyleProps, ITextFieldStyles, Label, Panel, PanelType, PrimaryButton, SelectionMode, Stack, TextField, TooltipHost, Text } from "@fluentui/react";
import { animated, useSpring } from "@react-spring/web";
import { getAllUploadStatus, FileUploadBasicStatus, GetUploadStatusRequest, FileState, UserFeedback, getAllUserChatInteractions, UserChatInteraction, AccuracyState, logUserReviewComment } from "../../api";

import styles from "./EvaluateAccuracy.module.css";
import { ArrowClockwise24Regular, DocumentFolderFilled, ImageBorderFilled } from "@fluentui/react-icons";
//import { IDocument } from "../FileStatus/DocumentsDetailList";
import { StatusContent } from "../StatusContent/StatusContent";
import classNames from "classnames";

const dropdownTimespanStyles: Partial<IDropdownStyles> = { dropdown: { width: 150 } };

const dropdownTimespanOptions = [
    { key: 'Time Range', text: 'End time range', itemType: DropdownMenuItemType.Header },
    { key: '4hours', text: '4 hours' },
    { key: '12hours', text: '12 hours' },
    { key: '24hours', text: '24 hours' },
    { key: '7days', text: '7 days' },
    { key: '30days', text: '30 days' },
    { key: '-1days', text: 'All' },
  ];

  const dropdownAccuracyStateOptions = [
    { key: 'AccuraceyStates', text: 'Accuracy States', itemType: DropdownMenuItemType.Header },
    { key: AccuracyState.ALL, text: 'All' },
    { key: AccuracyState.UNEVALUATED, text: 'All' },
    { key: AccuracyState.CORRECT, text: 'Correct' },
    { key: AccuracyState.INCORRECT, text: 'Incorrect' },
    { key: AccuracyState.PARTIAL, text: 'Partial' },
  ];

interface Props {
    className?: string;
}

export const EvaluateAccuracy = ({ className }: Props) => {
    const [selectedTimeFrameItem, setSelectedTimeFrameItem] = useState<IDropdownOption>();
    const [selectedAccuracyStateItem, setSelectedAccuracyStateItem] = useState<IDropdownOption>();
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [value, setValue] = useState<UserChatInteraction>();
    const [stateDialogVisible, setStateDialogVisible] = useState(false);
    const [userAccuracyStateChange, setUserAccuracyStateChange] = useState<IDropdownOption>();
    const [userReviewCommentChange, setUserReviewCommentChange] = useState<string>('');

    const [files, setFiles] = useState<UserChatInteraction[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onTimeSpanChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedTimeFrameItem(item);
    };

    const onUserAccuracyStateChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setUserAccuracyStateChange(item);
    };

    const onAccuracyStateChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedAccuracyStateItem(item);
    };

    const onUserChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setSelectedUser(newValue || "");
    };

    const onUserReviewCommentChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUserReviewCommentChange(newValue || "");
    };

    const refreshProp = (item: UserChatInteraction) => {
        setValue(item);
    };

    const onStateColumnClick = (item: UserChatInteraction) => {
        try {
            refreshProp(item);
            setStateDialogVisible(true);
        } catch (error) {
            console.error("Error on column click:", error);
            // Handle error here, perhaps show an error message to the user
        }
    };

    const onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        /*const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        const newItems = copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
        items = newItems as UserFeedback[];
        setFiles(newItems); 
        setColumns(newColumns);
        onFilesSorted == undefined ? console.log("onFileSorted event undefined") : onFilesSorted(items);*/
    };

    /*function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
        const key = columnKey as keyof T; // Cast columnKey to the type of the keys of T
        const sortedItems = items.slice().sort((a: T, b: T) => {
            if (columnKey === 'name') {
                const nameA = String(a[key]).toLowerCase();
                const nameB = String(b[key]).toLowerCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            } else {
                return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
            }
        });
        return isSortedDescending ? sortedItems.reverse() : sortedItems;
    }*/

    function getKey(item: any, index?: number): string {
        return item.key;
    }

    function onItemInvoked(item: any): void {
        //alert(`Item invoked: ${item.name}`);
    }

    var items=files == undefined ? [] : files

    /*const onFilesSorted = (items: UserFeedback[]): void => {
        setFiles(items);
    };*/

    const onGetStatusClick = async () => {
        setIsLoading(true);
        var timeframe : number = 4;
        switch (selectedTimeFrameItem?.key as string) {
            case "4hours":
                timeframe = 4;
                break;
            case "12hours":
                timeframe = 12;
                break;
            case "24hours":
                timeframe = 24;
                break;
            case "7days":
                timeframe = 168;
                break;
            case "30days":
                timeframe = 720;
                break;
            case "-1days":
                timeframe = -1;
                break;
            default:
                timeframe = 4;
                break;
        }

        const req = {
            timeframe: timeframe,
            state: selectedAccuracyStateItem?.key == undefined ? "All" : selectedAccuracyStateItem?.key as string,
            user: selectedUser
        }
        const response = await getAllUserChatInteractions(req);
        setIsLoading(false);
        setFiles(response);
    }

    useEffect(() => {
        //TODO
    }, []);

    /*function convertStatusToItems(fileList: FileUploadBasicStatus[]) {
        const items: UserFeedback[] = [];
        for (let i = 0; i < fileList.length; i++) {
            let fileExtension = fileList[i].file_name.split('.').pop();
            fileExtension = fileExtension == undefined ? 'Folder' : fileExtension.toUpperCase()
            try {
                items.push({
                    key: fileList[i].id,
                    name: fileList[i].file_name,
                    iconName: FILE_ICONS[fileExtension.toLowerCase()],
                    fileType: fileExtension,
                    filePath: fileList[i].file_path,
                    fileFolder: fileList[i].file_path.slice(0, fileList[i].file_path.lastIndexOf('/')),
                    state: fileList[i].state,
                    state_description: fileList[i].state_description,
                    upload_timestamp: fileList[i].start_timestamp,
                    modified_timestamp: fileList[i].state_timestamp,
                    status_updates: fileList[i].status_updates.map(su => ({
                        status: su.status,
                        status_timestamp: su.status_timestamp,
                        status_classification: su.status_classification,
                    })),
                    value: fileList[i].id,
                    tags: fileList[i].tags
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        return items;
    }*/

    const animatedStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 }
    });

    const [columns, setColumns] = useState<IColumn[]> ([
        {
            key: 'user',
            name: 'User',
            fieldName: 'user',
            minWidth: 150,
            maxWidth: 250,
            isRowHeader: true,
            isResizable: true,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            onColumnClick: onColumnClick,
            data: 'string',
            isPadded: true,
        },
        {
            key: 'prompt',
            name: 'Prompt',
            fieldName: 'prompt',
            minWidth: 150,
            maxWidth: 180,
            isResizable: true,
            ariaLabel: 'Accuracy',
            onColumnClick: onColumnClick,
            data: 'string',
            onRender: (item: UserChatInteraction) => (
                <TooltipHost content={`${item.PROMPT} `}>
                    <span onClick={() => onStateColumnClick(item)} style={{ cursor: 'pointer' }}>
                        {item.PROMPT}
                    </span>
                </TooltipHost>
            ), 
        },
        {
            key: 'response',
            name: 'Response',
            fieldName: 'response',
            minWidth: 210,
            maxWidth: 350,
            isResizable: true,
            ariaLabel: 'Response',
            onColumnClick: onColumnClick,
            data: 'string',
            onRender: (item: UserChatInteraction) => (
                <TooltipHost content={`${item.RESPONSE} `}>
                    <span onClick={() => onStateColumnClick(item)} style={{ cursor: 'pointer' }}>
                        {item.RESPONSE}
                    </span>
                </TooltipHost>
            ), 
        },
        {
            key: 'start_time',
            name: 'Start',
            fieldName: 'start_time',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            isCollapsible: true,
            ariaLabel: 'Start',
            data: 'string',
            onColumnClick: onColumnClick,
            isPadded: true,
        },
        {
            key: 'end_time',
            name: 'End',
            fieldName: 'end_time',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            isCollapsible: true,
            ariaLabel: 'End',
            data: 'string',
            onColumnClick: onColumnClick,
            isPadded: true,
        },
        {
            key: 'state',
            name: 'State',
            fieldName: 'state',
            minWidth: 150,
            maxWidth: 180,
            isResizable: true,
            ariaLabel: 'State',
            onColumnClick: onColumnClick,
            data: 'string',
            onRender: (item: UserChatInteraction) => (
                <TooltipHost content={`${item.STATE} `}>
                    <span onClick={() => onStateColumnClick(item)} style={{ cursor: 'pointer' }}>
                        {item.STATE}
                    </span>
                </TooltipHost>
            ), 
        }
    ]);

    function getStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
        return {
          fieldGroup: [
            { width: 300 },
          ]
        };
    }

    const DisplayData=value?.CITATIONS.map(
        (citation)=>{
            return(
                <tr>
                    <td>{citation}</td>
                </tr>
            )
        }
    )

    async function handleUpdate() {
        try {
            const reviewComment = ({
                id: value?.ID,
                state: userAccuracyStateChange?.text, 
                review_comment: userReviewCommentChange 
              });
            await logUserReviewComment(reviewComment);
        } catch (error) {
            // Handle the error here
            console.log(error);
        }
        setStateDialogVisible(false);
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.options} ${className ?? ""}`} >
                <Dropdown
                        label="Searched in last:"
                        defaultSelectedKey='4hours'
                        onChange={onTimeSpanChange}
                        placeholder="Select a time range"
                        options={dropdownTimespanOptions}
                        styles={dropdownTimespanStyles}
                        aria-label="timespan options for search to be displayed"
                    />
                <Dropdown
                        label="Accuracy State:"
                        defaultSelectedKey={'ALL'}
                        onChange={onAccuracyStateChange}
                        placeholder="Select accuracy states"
                        options={dropdownAccuracyStateOptions}
                        styles={dropdownTimespanStyles}
                        aria-label="accuracy state options for accuracy statuses to be displayed"
                    />
                <TextField label='User:' styles={getStyles} onChange={onUserChange}/>
            </div>
            {isLoading ? (
                <animated.div style={{ ...animatedStyles }}>
                     <Stack className={styles.loadingContainer} verticalAlign="space-between">
                        <Stack.Item grow>
                            <p className={styles.loadingText}>
                                Getting user chat interactions
                                <span className={styles.loadingdots} />
                            </p>
                        </Stack.Item>
                    </Stack>
                </animated.div>
            ) : (
                <div className={styles.resultspanel}>
                    {/*<DocumentsDetailList items={files == undefined ? [] : files} onFilesSorted={onFilesSorted} onRefresh={onGetStatusClick}/>*/}
                    <div>
                        <div className={styles.buttonsContainer}>
                            <div className={`${styles.refresharea} ${styles.divSpacing}`} onClick={onGetStatusClick} aria-label=" Refresh">
                                <ArrowClockwise24Regular className={styles.refreshicon} />
                                <span className={`${styles.refreshtext} ${styles.centeredText}`}>Refresh</span>
                            </div>
                        </div>
                        <span className={styles.footer}>{"(" + items.length as string + ") records."}</span>
                        <DetailsList
                            items={items}
                            compact={true}
                            columns={columns}
                            selectionMode={SelectionMode.none} // Allow none selection
                            getKey={getKey}
                            setKey="none"
                            layoutMode={DetailsListLayoutMode.justified}
                            isHeaderVisible={true}
                            onItemInvoked={onItemInvoked}
                        />
                        <span className={styles.footer}>{"(" + items.length as string + ") records."}</span>
                    </div>
                    <Panel
                        headerText="Status Log"
                        isOpen={stateDialogVisible}
                        isBlocking={false}
                        onDismiss={() => setStateDialogVisible(false)}
                        closeButtonAriaLabel="Close"
                        onRenderFooterContent={() => <DefaultButton onClick={() => setStateDialogVisible(false)}>Close</DefaultButton>}
                        isFooterAtBottom={true}
                        type={PanelType.medium}
                    >
                        <div className={styles.resultspanel}>
                            <div>
                                <Label>Prompt</Label><Text>{value?.PROMPT}</Text>
                                <Label>Response</Label><Text>{value?.RESPONSE}</Text>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                        <th>Document</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DisplayData}
                                    </tbody>
                                </table>
                                <Label>State</Label>
                                <Dropdown
                                    label="Accuracy State:"
                                    defaultSelectedKey={value?.STATE}
                                    onChange={onUserAccuracyStateChange}
                                    placeholder="Select accuracy states"
                                    options={dropdownAccuracyStateOptions}
                                    styles={dropdownTimespanStyles}
                                    aria-label="accuracy state options for accuracy statuses to be displayed"
                                />
                                <Label>Review Comment</Label>
                                <TextField styles={getStyles} onChange={onUserReviewCommentChange} value={value?.REVIEW_COMMENT}/>
                                <br /><br />
                                <button
                                onClick={handleUpdate}
                                className={classNames(
                                    styles.feedback_button,
                                    ""
                                )}
                                aria-label="Update"
                                >
                                Update
                                </button>
                            </div>
                        </div>
                    </Panel>                    
                </div>
            )}
        </div>
    );
}