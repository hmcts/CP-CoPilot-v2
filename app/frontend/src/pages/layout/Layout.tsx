// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Outlet, NavLink, Link } from "react-router-dom";
//import openai from "../../assets/openai.svg";
import mojlogo from "../../assets/moj_logo_new.png";
import { WarningBanner } from "../../components/WarningBanner/WarningBanner";
import styles from "./Layout.module.css";
import { Title } from "../../components/Title/Title";
import { getFeatureFlags, GetFeatureFlagsResponse } from "../../api";
import { GetWhoAmIResponse } from "../../api";
import { useEffect, useState } from "react";

export const Layout = () => {
    const [featureFlags, setFeatureFlags] = useState<GetFeatureFlagsResponse | null>(null);
    const [whoAmIData, setWhoAmIData] = useState<GetWhoAmIResponse | null>(null);

    async function fetchFeatureFlags() {
        try {
            const fetchedFeatureFlags = await getFeatureFlags();
            setFeatureFlags(fetchedFeatureFlags);
        } catch (error) {
            // Handle the error here
            console.log(error);
        }
    }

    async function fetchWhoAmIData() {
        try {
            //console.log("fetchedWhoAmIData");
            const response = await fetch("/.auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const fetchedWhoAmIData = await response.json();
            //console.log(fetchedWhoAmIData);
            const user_name = fetchedWhoAmIData[0].user_claims.filter(function(el: any){return el.typ == "name"})[0].val;
            const user_roles = fetchedWhoAmIData[0].user_claims.filter(function(el: any){return el.typ == "roles"})[0].val;
            const user_id = fetchedWhoAmIData[0].user_claims.filter(function(el: any){return el.typ == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"})[0].val;

            setWhoAmIData({USER_NAME: user_name, USER_ROLES: user_roles, USER_ID: user_id});

        } catch (error) {
            // Handle the error here
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFeatureFlags();
        fetchWhoAmIData();
    }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <WarningBanner />
                <div className={styles.headerContainer}>
                    <div className={styles.headerTitleContainer}>
                        <img src={mojlogo} alt="HM Courts & Tribunals Service" className={styles.headerLogo} />
                        <h3 className={styles.headerTitle}><Title /></h3>
                    </div>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li>
                            {whoAmIData?.USER_ROLES == "Admin" &&
                                <li className={styles.headerNavLeftMargin}>
                                    <NavLink to="/content" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                        Manage Content
                                    </NavLink>
                                </li>
                            }
                            {whoAmIData?.USER_ROLES == "Admin" &&
                                <li className={styles.headerNavLeftMargin}>
                                    <NavLink to="/evaluation" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                        Evaluation
                                    </NavLink>
                                </li>
                            }
                            {featureFlags?.ENABLE_MATH_ASSISTANT &&
                                <li className={styles.headerNavLeftMargin}>
                                    <NavLink to="/tutor" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Math Assistant
                                    <br />  
                                    <p className={styles.centered}>(preview)</p>
                                    </NavLink>
                                </li>
                            }
                            {featureFlags?.ENABLE_TABULAR_DATA_ASSISTANT &&
                                <li className={styles.headerNavLeftMargin}>
                                    <NavLink to="/tda" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Tabular Data Assistant
                                    <br />  
                                    <p className={styles.centered}>(preview)</p>
                                    </NavLink>
                                    
                                      
                                </li>
                            }
                            {/*<li className={styles.headerNavLeftMargin}>
                                <NavLink to="../../.auth/logout" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Sign Out
                                </NavLink>
                            </li>*/}
                        </ul>
                    </nav>
                    <div className={styles.headerTitleContainer}>
                        <h4 className={styles.headerTitle}>{whoAmIData?.USER_NAME}</h4>
                    </div>
                </div>
            </header>

            <Outlet />

            <footer>
                <WarningBanner />
            </footer>
        </div>
    );
};
