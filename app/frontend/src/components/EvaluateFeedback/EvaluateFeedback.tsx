// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { DefaultButton, DetailsList, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IColumn, ITextFieldStyleProps, ITextFieldStyles, Panel, PanelType, PrimaryButton, SelectionMode, Stack, TextField, TooltipHost } from "@fluentui/react";
import { animated, useSpring } from "@react-spring/web";
import { getAllUploadStatus, FileUploadBasicStatus, GetUploadStatusRequest, FileState, UserFeedback, getAllUserFeedback } from "../../api";

import styles from "./EvaluateFeedback.module.css";
import { ArrowClockwise24Regular, DocumentFolderFilled, ImageBorderFilled } from "@fluentui/react-icons";
//import { IDocument } from "../FileStatus/DocumentsDetailList";
//import { StatusContent } from "../StatusContent/StatusContent";

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

interface Props {
    className?: string;
}

export const EvaluateFeedback = ({ className }: Props) => {
    const [selectedTimeFrameItem, setSelectedTimeFrameItem] = useState<IDropdownOption>();
    const [selectedUser, setSelectedUser] = useState<string>('');


    const [files, setFiles] = useState<UserFeedback[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onTimeSpanChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedTimeFrameItem(item);
    };

    const onUserChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setSelectedUser(newValue || "");
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
            user: selectedUser
        }
        const response = await getAllUserFeedback(req);
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
            key: 'accuracy',
            name: 'Accuracy',
            fieldName: 'accuracy',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            ariaLabel: 'Accuracy',
            onColumnClick: onColumnClick,
            data: 'string',
        },
        {
            key: 'ease_of_use',
            name: 'Ease of Use',
            fieldName: 'ease_of_use',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            ariaLabel: 'Ease of Use',
            onColumnClick: onColumnClick,
            data: 'string',
        },
        {
            key: 'response_time',
            name: 'Response Time',
            fieldName: 'response_time',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            ariaLabel: 'Response Time',
            onColumnClick: onColumnClick,
            data: 'string',
        },
        {
            key: 'helpful',
            name: 'Helpful',
            fieldName: 'helpful',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            ariaLabel: 'Helpful',
            onColumnClick: onColumnClick,
            data: 'string',
        },
        {
            key: 'reusability',
            name: 'Reusability',
            fieldName: 'reusability',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            ariaLabel: 'Reusability',
            onColumnClick: onColumnClick,
            data: 'string',
        },
        {
            key: 'timestamp',
            name: 'Submitted On',
            fieldName: 'timestamp',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            isCollapsible: true,
            ariaLabel: 'Timestamp',
            data: 'string',
            onColumnClick: onColumnClick,
            isPadded: true,
        }
    ]);

    function getStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
        return {
          fieldGroup: [
            { width: 300 },
          ]
        };
    }

    return (
        <div className={styles.container}>
            <div className=''>
                <Dropdown
                        label="Provided in last:"
                        defaultSelectedKey='4hours'
                        onChange={onTimeSpanChange}
                        placeholder="Select a time range"
                        options={dropdownTimespanOptions}
                        styles={dropdownTimespanStyles}
                        aria-label="timespan options for feedback to be displayed"
                    />
                <TextField label='User:' styles={getStyles} onChange={onUserChange}/>
            </div>
            {isLoading ? (
                <animated.div style={{ ...animatedStyles }}>
                     <Stack className={styles.loadingContainer} verticalAlign="space-between">
                        <Stack.Item grow>
                            <p className={styles.loadingText}>
                                Getting user feedback
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
                </div>
            )}
        </div>
    );
}