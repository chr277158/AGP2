prompt --application/set_environment
set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- Oracle APEX export file
--
-- You should run this script using a SQL client connected to the database as
-- the owner (parsing schema) of the application or as a database user with the
-- APEX_ADMINISTRATOR_ROLE role.
--
-- This export file has been automatically generated. Modifying this file is not
-- supported by Oracle and can lead to unexpected application and/or instance
-- behavior now or in the future.
--
-- NOTE: Calls to apex_application_install override the defaults below.
--
--------------------------------------------------------------------------------
begin
wwv_flow_imp.import_begin (
 p_version_yyyy_mm_dd=>'2024.11.30'
,p_default_workspace_id=>41867110905587740900
);
end;
/
prompt  WORKSPACE 41867110905587740900
--
-- Workspace, User Group, User, and Team Development Export:
--   Date and Time:   16:13 Vendredi Février 13, 2026
--   Exported By:     CHIRAZ
--   Export Type:     Workspace Export
--   Version:         24.2.0
--   Instance ID:     1000108889432451
--
-- Import:
--   Using Instance Administration / Manage Workspaces
--   or
--   Using SQL*Plus as the Oracle user APEX_240200
 
begin
    wwv_flow_imp.set_security_group_id(p_security_group_id=>41867110905587740900);
end;
/
----------------
-- W O R K S P A C E
-- Creating a workspace will not create database schemas or objects.
-- This API creates only the meta data for this APEX workspace
prompt  Creating workspace GCT...
begin
wwv_flow_fnd_user_api.create_company (
  p_id => 41868556851856757833
 ,p_provisioning_company_id => 41867110905587740900
 ,p_short_name => 'GCT'
 ,p_display_name => 'GCT'
 ,p_first_schema_provisioned => 'WKSP_GCT'
 ,p_company_schemas => 'STEG2:WKSP_GCT'
 ,p_expire_fnd_user_accounts => 'Y'
 ,p_account_lifetime_days => 45
 ,p_fnd_user_max_login_failures => 4
 ,p_account_status => 'ASSIGNED'
 ,p_allow_plsql_editing => 'Y'
 ,p_allow_app_building_yn => 'Y'
 ,p_allow_packaged_app_ins_yn => 'Y'
 ,p_allow_sql_workshop_yn => 'Y'
 ,p_allow_team_development_yn => 'Y'
 ,p_allow_to_be_purged_yn => 'Y'
 ,p_allow_restful_services_yn => 'Y'
 ,p_source_identifier => 'GCT'
 ,p_webservice_logging_yn => 'Y'
 ,p_path_prefix => 'GCT'
 ,p_files_version => 1
 ,p_is_extension_yn => 'N'
 ,p_env_banner_yn => 'N'
 ,p_env_banner_pos => 'LEFT'
);
end;
/
----------------
-- G R O U P S
--
prompt  Creating Groups...
begin
wwv_flow_fnd_user_api.create_user_group (
  p_id => 2800914389484287,
  p_GROUP_NAME => 'OAuth2 Client Developer',
  p_SECURITY_GROUP_ID => 10,
  p_GROUP_DESC => 'Users authorized to register OAuth2 Client Applications');
end;
/
begin
wwv_flow_fnd_user_api.create_user_group (
  p_id => 2800847563484287,
  p_GROUP_NAME => 'RESTful Services',
  p_SECURITY_GROUP_ID => 10,
  p_GROUP_DESC => 'Users authorized to use RESTful Services with this workspace');
end;
/
begin
wwv_flow_fnd_user_api.create_user_group (
  p_id => 2800773760484287,
  p_GROUP_NAME => 'SQL Developer',
  p_SECURITY_GROUP_ID => 10,
  p_GROUP_DESC => 'Users authorized to use SQL Developer with this workspace');
end;
/
prompt  Creating group grants...
----------------
-- U S E R S
-- User repository for use with APEX cookie-based authentication.
--
prompt  Creating Users...
begin
wwv_flow_fnd_user_api.create_fnd_user (
  p_user_id                      => '43759362125021439384',
  p_user_name                    => 'CHIRAZ',
  p_first_name                   => 'chiraz',
  p_last_name                    => '',
  p_description                  => '',
  p_email_address                => 'chr22221399@gmail.com',
  p_web_password                 => '44D05678E209DF02AADCD68911758FD8091E51304394FC4BE4F0634D29C47F462CE8BB72CFFB6D64CF403445AE45F894D3D9796339FD4EF27252F353829EABD2',
  p_web_password_format          => '5;5;10000',
  p_group_ids                    => '2800773760484287:2800847563484287:2800914389484287:',
  p_developer_privs              => 'ADMIN:CREATE:DATA_LOADER:EDIT:HELP:MONITOR:SQL',
  p_default_schema               => 'WKSP_GCT',
  p_account_locked               => 'N',
  p_account_expiry               => to_date('202601020000','YYYYMMDDHH24MI'),
  p_failed_access_attempts       => 0,
  p_change_password_on_first_use => 'N',
  p_first_password_use_occurred  => 'Y',
  p_allow_app_building_yn        => 'Y',
  p_allow_sql_workshop_yn        => 'Y',
  p_allow_team_development_yn    => 'Y',
  p_default_date_format          => 'DD/MM/YYYY',
  p_allow_access_to_schemas      => '');
end;
/
begin
wwv_flow_fnd_user_api.create_fnd_user (
  p_user_id                      => '43444784072794426053',
  p_user_name                    => 'CHR277158',
  p_first_name                   => '',
  p_last_name                    => '',
  p_description                  => '',
  p_email_address                => 'chr22221399@gmail.com',
  p_web_password                 => '0F3D044E627157EA79841E84D022EC170E00CB96C87CBAD6685AE44475A8A8E46D01A34ACE3F5B668820CC409A2884F4BE8E70EE807C400ED78462EDB98931B1',
  p_web_password_format          => '5;5;10000',
  p_group_ids                    => '2800773760484287:2800847563484287:2800914389484287:',
  p_developer_privs              => 'ADMIN:CREATE:DATA_LOADER:EDIT:HELP:MONITOR:SQL',
  p_default_schema               => 'WKSP_GCT',
  p_account_locked               => 'N',
  p_account_expiry               => to_date('202406130908','YYYYMMDDHH24MI'),
  p_failed_access_attempts       => 0,
  p_change_password_on_first_use => 'N',
  p_first_password_use_occurred  => 'Y',
  p_allow_app_building_yn        => 'Y',
  p_allow_sql_workshop_yn        => 'Y',
  p_allow_team_development_yn    => 'Y',
  p_allow_access_to_schemas      => '');
end;
/
begin
wwv_flow_fnd_user_api.create_fnd_user (
  p_user_id                      => '41867110892484740900',
  p_user_name                    => 'CHR277158@GMAIL.COM',
  p_first_name                   => 'chiraz',
  p_last_name                    => 'ghodhben',
  p_description                  => '',
  p_email_address                => 'chr277158@gmail.com',
  p_web_password                 => 'B331C0BAC02F6A152E21141982ED7CA3AAFB7408A29FBCBE5739F7D8502F85B3E3A3477126601832AB10222E76BBE96E729FDE34E9CB5E2C87A9E660F8EB4B1B',
  p_web_password_format          => '5;5;10000',
  p_group_ids                    => '2800773760484287:2800847563484287:2800914389484287:',
  p_developer_privs              => 'ADMIN:CREATE:DATA_LOADER:EDIT:HELP:MONITOR:SQL',
  p_default_schema               => 'GCT2',
  p_account_locked               => 'N',
  p_account_expiry               => to_date('202501101056','YYYYMMDDHH24MI'),
  p_failed_access_attempts       => 0,
  p_change_password_on_first_use => 'Y',
  p_first_password_use_occurred  => 'Y',
  p_allow_app_building_yn        => 'Y',
  p_allow_sql_workshop_yn        => 'Y',
  p_allow_team_development_yn    => 'Y',
  p_default_date_format          => 'DD/MM/YY',
  p_allow_access_to_schemas      => '');
end;
/
---------------------------
-- D G  B L U E P R I N T S
-- Creating Data Generator Blueprints...
prompt Check Compatibility...
begin
-- This date identifies the minimum version required to import this file.
wwv_flow_team_api.check_version(p_version_yyyy_mm_dd=>'2010.05.13');
end;
/
 
begin wwv_flow.g_import_in_progress := true; wwv_flow.g_user := USER; end; 
/
 
--
prompt ...feedback
--
begin
wwv_flow_team_api.create_feedback (
  p_id => 14335639556344951 + wwv_flow_team_api.g_id_offset
 ,p_feedback_id => 3
 ,p_feedback_comment => 'in'
 ,p_feedback_type => 1
 ,p_feedback_status => 0
 ,p_public_response => 'installation accorder dans quelque jours '||chr(10)||
'merci'
 ,p_application_id => 102
 ,p_application_name => 'Suivi Des Appels D''offre V1.23'
 ,p_page_id => 1
 ,p_page_name => 'Page d''accueil'
 ,p_page_last_updated_by => 'CHIRAZ'
 ,p_page_last_updated_on => to_date('20251126090053','YYYYMMDDHH24MISS')
 ,p_session_id => '8175751754358'
 ,p_apex_user => '3455'
 ,p_user_email => 'unknown'
 ,p_application_version => 'Release 1.2'
 ,p_session_info => 'security_group_id=41867110905587740900'||chr(10)||
'expires_on=26/11/2025'||chr(10)||
'ip_address=10.63.1.50'||chr(10)||
'session_id='||chr(10)||
'created_on=26/11/2025'
 ,p_session_state => 'P0_MAT="u4xGSwMIyN_CJgnxb7CAoQ"'||chr(10)||
'P0_USER="DU5DDlxWV7A1f6QIn1Buay8E6CuPAL9DklOzZ2HVtEI"'||chr(10)||
'P10050_PAGE_ID="mL5c9qxTsy2dyVKBdL7d-Q"'||chr(10)||
'P10050_USER_AGENT="TlomDZhbENUmgSA-d85Gt7JJArkuLwuyi--8HkBYc81I1CITt6"'||chr(10)||
'P10050_RATING="eocWpTSrND152i85fcAjjQ"'||chr(10)||
'P10050_FEEDBACK="rGcnTnWetTi_mbSssEibUg"'||chr(10)||
''
 ,p_parsing_schema => 'WKSP_GCT'
 ,p_http_user_agent => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
 ,p_remote_addr => '10.63.1.50'
 ,p_remote_user => 'APEX_PUBLIC_USER'
 ,p_http_host => '10.63.1.42'
 ,p_server_name => '10.63.1.42'
 ,p_server_port => '80'
 ,p_logging_security_group_id => 41867110905587740900
 ,p_logged_by_workspace_name => 'GCT'
 ,p_created_by => '3455'
 ,p_created_on => to_timestamp_tz('20251126095526.370000000 +01:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
 ,p_updated_by => '91591'
 ,p_updated_on => to_timestamp_tz('20251126100129.455000000 +01:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
);
wwv_flow_team_api.create_feedback (
  p_id => 25606619654699517 + wwv_flow_team_api.g_id_offset
 ,p_feedback_id => 4
 ,p_feedback_type => 1
 ,p_feedback_status => 0
 ,p_application_id => 105
 ,p_application_name => 'Suivi Des Appels D''offre V1.25'
 ,p_page_id => 32
 ,p_page_name => 'Gestion des Rappels'
 ,p_page_last_updated_by => 'CHIRAZ'
 ,p_page_last_updated_on => to_date('20260205141753','YYYYMMDDHH24MISS')
 ,p_session_id => '7368614024355'
 ,p_apex_user => '91591'
 ,p_user_email => 'unknown'
 ,p_application_version => 'Release 1.4'
 ,p_session_info => 'security_group_id=41867110905587740900'||chr(10)||
'expires_on=13/02/2026'||chr(10)||
'ip_address=10.63.1.113'||chr(10)||
'session_id='||chr(10)||
'created_on=13/02/2026'
 ,p_session_state => 'P32_ROLE="Ef8s27bwLXZBu5YvPd44AQ"'||chr(10)||
'P0_ROLE="58VqiHjPKN5XSl-jCJPJHA"'||chr(10)||
'P1_ROLE="bke_EpeHQh1IxTd9a9pn8Q"'||chr(10)||
'P0_MAT="EZIsp7iviq4bKZkSib5ROA"'||chr(10)||
'P0_USER="mO9v0dH4JZS3NfT_kdp4WrpnwlQTFrZv3gUXhpl1vJs"'||chr(10)||
'P10050_PAGE_ID="9TDIXCUr6ie-fEronoMV9g"'||chr(10)||
'P10050_USER_AGENT="BXDKiqubUK89YTPebICjwyXxD7JfP-IZh7GYInA6_zUANvl0lq"'||chr(10)||
'P10050_RATING="93IfOvN0tQDHK0Idq_zIXQ"'||chr(10)||
'P22_TIMEFRAME="bJQIjSfCyOiqibBLHylZZg"'||chr(10)||
''
 ,p_parsing_schema => 'WKSP_GCT'
 ,p_http_user_agent => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
 ,p_remote_addr => '10.63.1.113'
 ,p_remote_user => 'APEX_PUBLIC_USER'
 ,p_http_host => '10.63.1.113:8443'
 ,p_server_name => '10.63.1.113'
 ,p_server_port => '8443'
 ,p_logging_security_group_id => 41867110905587740900
 ,p_logged_by_workspace_name => 'GCT'
 ,p_created_by => '91591'
 ,p_created_on => to_timestamp_tz('20260213133410.415000000 +01:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
 ,p_updated_by => '91591'
 ,p_updated_on => to_timestamp_tz('20260213133410.415000000 +01:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
);
wwv_flow_team_api.create_feedback (
  p_id => 11963102443251256066 + wwv_flow_team_api.g_id_offset
 ,p_feedback_id => 1
 ,p_feedback_comment => 'Merci'
 ,p_feedback_type => 1
 ,p_feedback_status => 0
 ,p_application_id => 147311
 ,p_application_name => 'Suivi Des Appels D''offre'
 ,p_page_id => 1
 ,p_page_name => 'Page d''accueil'
 ,p_page_last_updated_by => 'CHR277158@GMAIL.COM'
 ,p_page_last_updated_on => to_date('20220929112533','YYYYMMDDHH24MISS')
 ,p_session_id => '6743326211546'
 ,p_apex_user => 'CHIRAZ'
 ,p_user_email => 'chr22221399@gmail.com'
 ,p_application_version => 'Release 1.2'
 ,p_session_info => 'security_group_id=41867110905587740900'||chr(10)||
'expires_on=05/11/2022'||chr(10)||
'ip_address=100.114.32.2'||chr(10)||
'session_id='||chr(10)||
'created_on=04/11/2022'
 ,p_session_state => '="1:15:5:0"'||chr(10)||
'P4_NEW="bAQWASOFDXrO5c0ZmRG5xA"'||chr(10)||
'P4_NEW_1="z5ri3zlbjeVuZX3h0GKOtQ"'||chr(10)||
'P0_USER="440FSQ6e9GIdRGnpgIh3FA"'||chr(10)||
'="'||chr(10)||
'P3_SEARCH="yMPYiEnBVitU2yhv88S1DA"'||chr(10)||
'P10034_TIMEFRAME="tewfMemIYE534Ef_ctJaKQ"'||chr(10)||
'P10033_TIMEFRAME="E6q1R_Fu-VQCUK_zv11a2w"'||chr(10)||
'P10050_PAGE_ID="V3JhxCYfv7HeMOCdVLLOtg"'||chr(10)||
'P10050_USER_AGENT="08gyjO-4X0rv69uwMPYSusStWE_waFUlKX7flsICUhXfube0cs"'||chr(10)||
'P10050_RATING="dM-webmvE1OeBiZwEzOuPQ"'||chr(10)||
'P10050_FEEDBACK="F6HyAA8BclkKIx7yGYx-ag"'||chr(10)||
'P10061_PAGE_ID="TyBE07HsTcgHPJkSZXngpw"'||chr(10)||
'="1:10:4:0"'||chr(10)||
'="1:10:5:0"'||chr(10)||
'="1:50:2:0"'||chr(10)||
'="1:50:4:0"'||chr(10)||
''
 ,p_parsing_schema => 'WKSP_GCT'
 ,p_http_user_agent => 'Mozilla/5.0 (Linux; Android 8.1.0; SM-J260F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36'
 ,p_remote_addr => '196.235.216.102, 104.93.28.12, 23.202.51.20,100.114.32.4'
 ,p_remote_user => 'APEX_PUBLIC_USER'
 ,p_http_host => 'apex.oracle.com'
 ,p_server_name => 'apex.oracle.com'
 ,p_server_port => '443'
 ,p_logging_security_group_id => 41867110905587740900
 ,p_logged_by_workspace_name => 'GCT'
 ,p_created_by => 'CHIRAZ'
 ,p_created_on => to_timestamp_tz('20221104183517.686112000 +00:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
 ,p_updated_by => 'CHIRAZ'
 ,p_updated_on => to_timestamp_tz('20221104183517.686114000 +00:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
);
wwv_flow_team_api.create_feedback (
  p_id => 41339297914197997672 + wwv_flow_team_api.g_id_offset
 ,p_feedback_id => 2
 ,p_feedback_type => 1
 ,p_feedback_status => 0
 ,p_application_id => 147311
 ,p_application_name => 'Suivi Des Appels D''offre'
 ,p_page_id => 1
 ,p_page_name => 'Page d''accueil'
 ,p_page_last_updated_by => 'CHR277158@GMAIL.COM'
 ,p_page_last_updated_on => to_date('20221109073833','YYYYMMDDHH24MISS')
 ,p_session_id => '109458774248387'
 ,p_apex_user => 'CHIRAZ'
 ,p_user_email => 'chr22221399@gmail.com'
 ,p_application_version => 'Release 1.2'
 ,p_session_info => 'security_group_id=41867110905587740900'||chr(10)||
'expires_on=17/01/2023'||chr(10)||
'ip_address=100.114.32.4'||chr(10)||
'session_id='||chr(10)||
'created_on=17/01/2023'
 ,p_session_state => '="1:15:8:0"'||chr(10)||
'P4_NEW_2="lD85XOBnelQyYC5GeY99HQ"'||chr(10)||
'P0_USER="8a3euROYrLAV3BIt26_95g"'||chr(10)||
'="'||chr(10)||
'#THEME_DB_FILES#48359211659831803680.css apex-the"'||chr(10)||
'="1:50:11:0"'||chr(10)||
'P10050_USER_AGENT="-wd3_jVi3lfPzn5XutVddplG850qWU7sSK9lKQ2VJbcSEOUA7e"'||chr(10)||
'P10050_RATING="g__L3jK_FrxrBjJuRgE3aA"'||chr(10)||
'P10050_PAGE_ID="qqT-4rli2OHetrE1ffRGyg"'||chr(10)||
''
 ,p_parsing_schema => 'WKSP_GCT'
 ,p_http_user_agent => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
 ,p_remote_addr => '41.226.1.102, 79.140.80.244, 23.47.58.7,100.114.32.4'
 ,p_remote_user => 'APEX_PUBLIC_USER'
 ,p_http_host => 'apex.oracle.com'
 ,p_server_name => 'apex.oracle.com'
 ,p_server_port => '443'
 ,p_logging_security_group_id => 41867110905587740900
 ,p_logged_by_workspace_name => 'GCT'
 ,p_created_by => 'CHIRAZ'
 ,p_created_on => to_timestamp_tz('20230117103839.443894000 +00:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
 ,p_updated_by => 'CHIRAZ'
 ,p_updated_on => to_timestamp_tz('20230117103839.443896000 +00:00 ','YYYYMMDDHH24MISSxFF TZR TZD')
);
end;
/
--
prompt ...Issue Templates
--
begin
wwv_flow_team_api.create_issue_template (
  p_id => 41906168189508751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Modèle de bug'
 ,p_template_description => 'Modèle utilisé pour consigner un bug.'
 ,p_template_text => 
'**Comportement attendu**'||chr(10)||
'- Dites-nous ce qui doit se produire à votre avis.'||chr(10)||
''||chr(10)||
''||chr(10)||
'**Comportement en cours**'||chr(10)||
'- Dites-nous ce qui se produit.'||chr(10)||
''||chr(10)||
''||chr(10)||
'**Personnes affectées**'||chr(10)||
'- Dites-nous qui/ce qui est affecté. '||chr(10)||
''||chr(10)||
'**Solution possible**'||chr(10)||
'- Si vous le pouvez, proposez une manière de résoudre le bug.'||chr(10)||
''||chr(10)||
'**Etapes à reproduire**'||chr(10)||
'- Indiquez une série d''étapes claires à reproduire, avec des captures d''écran et des fragm'||
'ents de code si nécessaire.'||chr(10)||
'1.'||chr(10)||
'2.'||chr(10)||
'3.'||chr(10)||
''||chr(10)||
'**Contexte**'||chr(10)||
'- Que tentiez-vous de faire quand le bug s''est produit. Le bug ne se produit-il que dans certaines circonstances, à des moments précis de la journée, etc.'||chr(10)||
''||chr(10)||
'**Environnement**'||chr(10)||
''||chr(10)||
'- Version : '||chr(10)||
'- Plate-forme : '||chr(10)||
'- Sous-système :'||chr(10)||
''||chr(10)||
'______'||chr(10)||
''||chr(10)||
'_**Remarque :** pour associer un problème à une application et/ou une page, consignez tout d''abord le problème, puis u'||
'tilisez la liste déroulante **ACTIONS** pour associer l''application et la page._'
 ,p_template_type => 'ISSUE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168209466751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Modèle de demande de fonctionnalité'
 ,p_template_description => 'Modèle utilisé pour consigner une demande de fonctionnalité.'
 ,p_template_text => 
'**Récapitulatif de la fonctionnalité**'||chr(10)||
' - Donnez, en un paragraphe, un aperçu général de la fonctionnalité demandée.'||chr(10)||
''||chr(10)||
''||chr(10)||
'**Contexte**'||chr(10)||
' - Cette demande est-elle en rapport avec une situation ou un processus spécifique ? Par exemple, "C''est toujours frustrant de [...]"'||chr(10)||
''||chr(10)||
''||chr(10)||
' - Fournissez d''éventuelles informations complémentaires, y compris des captures d''écran, des cas d''emploi, etc.'||chr(10)||
''||chr(10)||
''||chr(10)||
'**Solution privil'||
'égiée**'||chr(10)||
'- Décrivez précisément la solution que vous aimeriez voir mise en oeuvre.'||chr(10)||
''||chr(10)||
''||chr(10)||
'**Autres solutions**'||chr(10)||
'- Décrivez les autres solutions ou fonctionnalités envisagées, ou les solutions de contournement utilisées.'||chr(10)||
''||chr(10)||
''||chr(10)||
'______'||chr(10)||
'_**Remarque :** pour associer un problème à une application et/ou une page, consignez tout d''abord le problème, puis utilisez la liste déroulante **ACTIONS** pour associer l''appl'||
'ication et la page._'
 ,p_template_type => 'ISSUE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168337077751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Procédure ...'
 ,p_template_description => 'Modèle utilisé pour poser une question de procédure.'
 ,p_template_text => 
'**Question**'||chr(10)||
'- Enoncez votre question ou votre demande aussi brièvement que possible.'||chr(10)||
''||chr(10)||
'**Contexte général**'||chr(10)||
'- Que tentez-vous de faire ? '||chr(10)||
''||chr(10)||
''||chr(10)||
'- Où avez-vous regardé ou qui avez-vous contacté pour trouver une réponse ? '||chr(10)||
''||chr(10)||
''||chr(10)||
'**Environnement** '||chr(10)||
'Cette question est-elle propre à un environnement, à un langage de programmation ou à un autre élément ?'||chr(10)||
''||chr(10)||
'______'||chr(10)||
'_**Remarque :** pour associer un problème à une a'||
'pplication et/ou une page, consignez tout d''abord le problème, puis utilisez la liste déroulante **ACTIONS** pour associer l''application et la page._'
 ,p_template_type => 'ISSUE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168460953751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Bug signalé'
 ,p_template_description => 'Un bug a été signalé.'
 ,p_template_text => 
'Un **bug** a été enregistré dans le système externe approprié.'||chr(10)||
''||chr(10)||
'- Système de suivi des bugs : '||chr(10)||
'- ID du bug : '||chr(10)||
'- URL du bug : '||chr(10)||
''||chr(10)||
'Commentaires :'
 ,p_template_type => 'RESPONSE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168534087751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Sans traitement'
 ,p_template_description => 'Ce problème ne sera pas traité'
 ,p_template_text => 
'Après réflexion, **aucune action ultérieure ne sera entreprise concernant ce problème**. '||chr(10)||
''||chr(10)||
'Commentaires :'
 ,p_template_type => 'RESPONSE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168635208751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Demande de fonctionnalité enregistrée'
 ,p_template_description => 'Une demande de fonctionnalité a été enregistrée.'
 ,p_template_text => 
'Une **demande de fonctionnalité** a été enregistrée dans le système externe approprié.'||chr(10)||
''||chr(10)||
'- Système de suivi des fonctionnalités : '||chr(10)||
'- ID de la fonctionnalité : '||chr(10)||
'- URL de la définition de la fonctionnalité : '||chr(10)||
''||chr(10)||
'Commentaires :'
 ,p_template_type => 'RESPONSE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168728808751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Problème connu'
 ,p_template_description => 'Référence à un problème connu.'
 ,p_template_text => 
'Après examen, il s''avère que ce problème est déjà connu. Consultez les détails ci-dessous.'||chr(10)||
''||chr(10)||
'- Système de suivi des bugs : '||chr(10)||
'- ID du bug : '||chr(10)||
'- URL du bug : '||chr(10)||
''||chr(10)||
'Commentaires : '
 ,p_template_type => 'RESPONSE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168856264751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Plus d''informations requises'
 ,p_template_description => 'Demande d''informations complémentaires.'
 ,p_template_text => 
'**Des informations complémentaires sont requises pour ce problème :**'||chr(10)||
''||chr(10)||
'Merci de fournir les informations demandées ci-dessous. Sans ces informations, il sera difficile de classifier le problème et de poursuivre sa résolution.'||chr(10)||
''||chr(10)||
''||chr(10)||
'Commentaires :'
 ,p_template_type => 'RESPONSE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_issue_template (
  p_id => 41906168940660751836 + wwv_flow_team_api.g_id_offset
 ,p_template_name => 'Action de suivi requise'
 ,p_template_description => 'Une action de suivi est nécessaire.'
 ,p_template_text => 
'Effectuez les actions suivantes : '||chr(10)||
''||chr(10)||
'1.'||chr(10)||
'2.'||chr(10)||
'3.'||chr(10)||
'4.'||chr(10)||
''||chr(10)||
'Commentaires : '
 ,p_template_type => 'RESPONSE'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
end;
/
--
prompt ...Issue Email Prefs
--
begin
wwv_flow_team_api.create_issue_email_prefs (
  p_id => 41906169455440751841 + wwv_flow_team_api.g_id_offset
 ,p_user_id => 'CHR277158@GMAIL.COM'
 ,p_receive_emails_yn => 'Y'
 ,p_notification_types => 'ISSUE_EDIT:COMMENT_ADD:COMMENT_EDIT:STATUS:ASSIGNEE:SUBSCRIBER:MILESTONE:LABEL:DUPLICATE:ASSOCIATION:ATTACHMENT'
 ,p_frequency => 'IMMEDIATELY'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
end;
/
--
prompt ...Label Groups
--
begin
wwv_flow_team_api.create_label_group (
  p_id => 41906164775224751834 + wwv_flow_team_api.g_id_offset
 ,p_group_name => 'Zone fonctionnelle'
 ,p_group_color => 'label-color-19'
 ,p_group_description => 'Zone fonctionnelle affectée par le problème.'
 ,p_values_are_exclusive => 'N'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label_group (
  p_id => 41906165662915751835 + wwv_flow_team_api.g_id_offset
 ,p_group_name => 'Catégorie'
 ,p_group_color => 'label-color-11'
 ,p_group_description => 'Catégorie affectée au problème.'
 ,p_values_are_exclusive => 'N'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label_group (
  p_id => 41906166522255751835 + wwv_flow_team_api.g_id_offset
 ,p_group_name => 'Importance'
 ,p_group_color => 'label-color-16'
 ,p_group_description => 'Importance accordée au problème.'
 ,p_values_are_exclusive => 'Y'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label_group (
  p_id => 41906167165973751835 + wwv_flow_team_api.g_id_offset
 ,p_group_name => 'Niveau d''effort'
 ,p_group_color => 'label-color-13'
 ,p_group_description => 'Efforts mis en oeuvre pour résoudre le problème.'
 ,p_values_are_exclusive => 'Y'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label_group (
  p_id => 41906167557465751835 + wwv_flow_team_api.g_id_offset
 ,p_group_name => 'Progression'
 ,p_group_color => 'label-color-14'
 ,p_group_description => 'Avancement par rapport au problème.'
 ,p_values_are_exclusive => 'Y'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
end;
/
--
prompt ...Labels
--
begin
wwv_flow_team_api.create_label (
  p_id => 41906164874151751834 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'UI / UX'
 ,p_label_desc => 'UI / UX'
 ,p_label_slug => 'ui-ux'
 ,p_display_sequence => 10
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906164932859751834 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'Base de données'
 ,p_label_desc => 'Base de données'
 ,p_label_slug => 'base-de-données'
 ,p_display_sequence => 20
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165099261751834 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'Intégration REST'
 ,p_label_desc => 'Intégration REST'
 ,p_label_slug => 'intégration-rest'
 ,p_display_sequence => 30
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165141771751834 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'CSS / HTML'
 ,p_label_desc => 'CSS / HTML'
 ,p_label_slug => 'css-html'
 ,p_display_sequence => 40
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165256513751834 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'Actions dynamiques/JavaScript'
 ,p_label_desc => 'Actions dynamiques/JavaScript'
 ,p_label_slug => 'actions-dynamiques-javascript'
 ,p_display_sequence => 50
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165325790751834 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'Sécurité'
 ,p_label_desc => 'Sécurité'
 ,p_label_slug => 'sécurité'
 ,p_display_sequence => 60
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165419997751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'Administration'
 ,p_label_desc => 'Administration'
 ,p_label_slug => 'administration'
 ,p_display_sequence => 70
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165571286751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906164775224751834
 ,p_label_name => 'Intégration système externe'
 ,p_label_desc => 'Intégration système externe'
 ,p_label_slug => 'intégration-système-externe'
 ,p_display_sequence => 80
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165706880751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Bug'
 ,p_label_desc => 'Bug'
 ,p_label_slug => 'bug'
 ,p_display_sequence => 10
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165843666751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Demande d''amélioration'
 ,p_label_desc => 'Demande d''amélioration'
 ,p_label_slug => 'demande-d-amélioration'
 ,p_display_sequence => 20
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906165906331751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Demande de fonctionnalité'
 ,p_label_desc => 'Demande de fonctionnalité'
 ,p_label_slug => 'demande-de-fonctionnalité'
 ,p_display_sequence => 30
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166067177751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Problème lié à la sécurité'
 ,p_label_desc => 'Problème lié à la sécurité'
 ,p_label_slug => 'problème-lié-à-la-sécurité'
 ,p_display_sequence => 40
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166137944751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Problème lié aux performances'
 ,p_label_desc => 'Problème lié aux performances'
 ,p_label_slug => 'problème-lié-aux-performances'
 ,p_display_sequence => 50
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166213836751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Problème lié à l''installation'
 ,p_label_desc => 'Problème lié à l''installation'
 ,p_label_slug => 'problème-lié-à-l-installation'
 ,p_display_sequence => 60
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166371807751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Problème lié à la documentation'
 ,p_label_desc => 'Problème lié à la documentation'
 ,p_label_slug => 'problème-lié-à-la-documentation'
 ,p_display_sequence => 70
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166497058751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906165662915751835
 ,p_label_name => 'Problème lié à la formation'
 ,p_label_desc => 'Problème lié à la formation'
 ,p_label_slug => 'problème-lié-à-la-formation'
 ,p_display_sequence => 80
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166654242751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906166522255751835
 ,p_label_name => 'Critique'
 ,p_label_desc => 'Critique'
 ,p_label_slug => 'critique'
 ,p_display_sequence => 10
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166743967751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906166522255751835
 ,p_label_name => 'Important'
 ,p_label_desc => 'Important'
 ,p_label_slug => 'important'
 ,p_display_sequence => 20
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166852158751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906166522255751835
 ,p_label_name => 'Normal'
 ,p_label_desc => 'Normal'
 ,p_label_slug => 'normal'
 ,p_display_sequence => 30
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906166987319751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906166522255751835
 ,p_label_name => 'Non traité'
 ,p_label_desc => 'Non traité'
 ,p_label_slug => 'non-traité'
 ,p_display_sequence => 40
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167017503751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906166522255751835
 ,p_label_name => 'Pas de résolution'
 ,p_label_desc => 'Pas de résolution'
 ,p_label_slug => 'pas-de-résolution'
 ,p_display_sequence => 50
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167226848751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167165973751835
 ,p_label_name => 'Correction facile'
 ,p_label_desc => 'Correction facile'
 ,p_label_slug => 'correction-facile'
 ,p_display_sequence => 10
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167347101751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167165973751835
 ,p_label_name => 'Efforts modérés'
 ,p_label_desc => 'Efforts modérés'
 ,p_label_slug => 'efforts-modérés'
 ,p_display_sequence => 20
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167454357751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167165973751835
 ,p_label_name => 'Efforts de développement importants'
 ,p_label_desc => 'Efforts de développement importants'
 ,p_label_slug => 'efforts-de-développement-importants'
 ,p_display_sequence => 30
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167623059751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167557465751835
 ,p_label_name => 'En cours'
 ,p_label_desc => 'En cours'
 ,p_label_slug => 'en-cours'
 ,p_display_sequence => 10
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167726049751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167557465751835
 ,p_label_name => 'Informations complémentaires requises'
 ,p_label_desc => 'Informations complémentaires requises'
 ,p_label_slug => 'informations-complémentaires-requises'
 ,p_display_sequence => 20
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167893632751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167557465751835
 ,p_label_name => 'En attente d''un tiers'
 ,p_label_desc => 'En attente d''un tiers'
 ,p_label_slug => 'en-attente-d-un-tiers'
 ,p_display_sequence => 30
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906167949010751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167557465751835
 ,p_label_name => 'Correction impossible'
 ,p_label_desc => 'Correction impossible'
 ,p_label_slug => 'correction-impossible'
 ,p_display_sequence => 40
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_label (
  p_id => 41906168074825751835 + wwv_flow_team_api.g_id_offset
 ,p_label_group_id => 41906167557465751835
 ,p_label_name => 'Terminé'
 ,p_label_desc => 'Terminé'
 ,p_label_slug => 'terminé'
 ,p_display_sequence => 50
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
end;
/
--
prompt ... Milestones
--
begin
wwv_flow_team_api.create_milestone (
  p_id => 41906169097146751837 + wwv_flow_team_api.g_id_offset
 ,p_milestone_name => 'Blocage du code'
 ,p_milestone_date => to_date('20220907121727','YYYYMMDDHH24MISS')
 ,p_milestone_status => 'OPEN'
 ,p_milestone_slug => 'blocage-du-code'
 ,p_milestone_id => 1
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_milestone (
  p_id => 41906169134546751837 + wwv_flow_team_api.g_id_offset
 ,p_milestone_name => 'Gel IU'
 ,p_milestone_date => to_date('20220922121727','YYYYMMDDHH24MISS')
 ,p_milestone_status => 'OPEN'
 ,p_milestone_slug => 'gel-iu'
 ,p_milestone_id => 2
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
wwv_flow_team_api.create_milestone (
  p_id => 41906169223873751837 + wwv_flow_team_api.g_id_offset
 ,p_milestone_name => 'Version finale'
 ,p_milestone_date => to_date('20221007121727','YYYYMMDDHH24MISS')
 ,p_milestone_status => 'OPEN'
 ,p_milestone_slug => 'version-finale'
 ,p_milestone_id => 3
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
end;
/
--
prompt ... Issues
--
begin
wwv_flow_team_api.create_issue (
  p_id => 41906169337053751839 + wwv_flow_team_api.g_id_offset
 ,p_title => 'Bienvenue dans le développement d''équipe dans Oracle APEX.'
 ,p_slug => 'welcome-to-team-development-in-oracle-apex'
 ,p_issue_text => 
'Bonjour ! '||chr(10)||
''||chr(10)||
'C''est votre tout premier problème. Vous pouvez créer des problèmes afin de suivre des tâches, des fonctionnalités, des bugs et des informations en retour pour tous vos projets APEX. Vous pouvez ajouter des libellés à des problèmes, ajouter des destinataires, définir des jalons et même appliquer un formatage à l''aide des raccourcis Markdown.  '||chr(10)||
''||chr(10)||
'Voici un exemple de ce que permet Markdown'||
' :'||chr(10)||
'# Orionis bellica Stygias partes'||chr(10)||
' '||chr(10)||
'## Solibus an rutilis cornu'||chr(10)||
' '||chr(10)||
'Lorem markdownum formosae. [Est medio](http://www.modomarte.com/cantu) et illi adunca? Miserum Phaethon, Editus, abrupta colonos; Aeeta annum; facere pruniceum '||chr(10)||
'**domat**, discussisque saevo, Tereo. _Quid noctis adhuc, nisi nemo dignos, aures sonus mentae conspecta?_ '||chr(10)||
' '||chr(10)||
'```js '||chr(10)||
'device_intranet_cloud(page_disk); '||chr(10)||
'if (81 >= scanner +'||
' realityHoneypot + intellectual_heuristic) { '||chr(10)||
'    ataDataWeb -= fileWormCamera + hypertext; '||chr(10)||
'    hdtv(-3 - 2); '||chr(10)||
'    folder(controlHtml, model - 5); '||chr(10)||
'} '||chr(10)||
'``` '||chr(10)||
' '||chr(10)||
'## Consortia dum mea aethere Deionidenque vixque est '||chr(10)||
' '||chr(10)||
'Forma duris igne duritiem Minervaetransformabantur, moriemur manibusque nulla eripienda est rima grave tu. Illis succedat fit. Ter amo quod plurima, non ab alimentaque adest videbitur a'||
't. Avidissima agam qui superba a partem [crines precantia limen](http://totovertice.com/vertice) in **ignibus spernit ritusque** iamdudum. '||chr(10)||
' '||chr(10)||
'> Arcum aristis arsit generosior in cum laevum suae, ferebat, hoc. Manus faciat, '||chr(10)||
'> nec inpetus sua silvas ossa? Incursant Nereide diversaeque velut signumque '||chr(10)||
'> Hectora, convellere caede hostesque oppida, diu viriles. Isdem **sacra**, '||chr(10)||
'> facta, in viximus a'||
'limentaque quae patria, ut derigere vires. '||chr(10)||
' '||chr(10)||
' '||chr(10)||
'### Inde erat dicente viribus '||chr(10)||
' '||chr(10)||
'Nomina aevumque pepercit ridet, vellet stetit tibi, Alcyone a Lelex adductis flumine stetit. *Fides* caeli gloria aquis neget meritis subitis tumulumque carmina illius non satis arces. Repressit volantes egesta, `et ira poscit` lacertis ita timidi. '||chr(10)||
' '||chr(10)||
'### Causam nec plagamque Minyis '||chr(10)||
' '||chr(10)||
'Venit caput vel sublimis haud ca'||
'usa et audire, terraeque sed, per duce gaudete Niobe fierent quantusque villis. Non **vallibus quinque vaga** densum si meruisse ponit olim terras saepe? Saxum sidera regia; feram hastarum os vigor sponte hinnitus inter est. '||chr(10)||
' '||chr(10)||
'- Vere furta ut exegi '||chr(10)||
'- Tempora poenaeque temptanti '||chr(10)||
'- Misisset est nec vicit edita hic '||chr(10)||
' '||chr(10)||
'Si ista Abantiades pennis, nusquam tu ira ego per. Ille sit, cum aditum culmine,'||
' primaque quae mira! Vix herbae volanti caeli, [quisquis](http://bello.org/ripae-maenalon), et capillis coepisse iacta, tibi anum, tum iam persequar. Videtur quotiensque vires. Firmo ocius coepta ipsum ignoro, Matri nec regni quod, stimulosque quam librata. '||chr(10)||
' '||chr(10)||
'1. Ille citaeque illo ille Crotonis terra '||chr(10)||
'2. Formatae lancea hac de iuvabat bicolor et '||chr(10)||
'3. Vastator consistere pondere te carmen consorti '||
'ex '||chr(10)||
' '||chr(10)||
' '||chr(10)||
'| In ante metus dictum at tempor   | Luctus accumsan | Bibendum | Consequat | '||chr(10)||
'|----------------------------------|----------------:|:--------:|-----------:| '||chr(10)||
'| Lectus arcu bibendum at varius   |            37.5 |   quam   |       .07 | '||chr(10)||
'| justo eget magna fermentum       |           127.2 |   lacus  |       .88 | '||chr(10)||
'| Platea dictumst quisque sagittis |            33.0 |   quam   |       .39'||
' | '
 ,p_row_version => 1
 ,p_status => 'OPEN'
 ,p_issue_number => 1
 ,p_deleted => 'N'
 ,p_created_on => to_date('20220823121727','YYYYMMDDHH24MISS')
 ,p_created_by => 'CHR277158@GMAIL.COM'
 ,p_updated_on => to_date('20250801094741','YYYYMMDDHH24MISS')
 ,p_updated_by => 'APEX_PUBLIC_USER'
);
end;
/
--
prompt ... Issue Attachments
--
begin
null;
end;
/
--
prompt ... Issues Milestones
--
begin
null;
end;
/
--
prompt ... Issues Labels
--
begin
null;
end;
/
--
prompt ... Issues stakeholders
--
begin
null;
end;
/
--
prompt ... Issues Comments
--
begin
null;
end;
/
--
prompt ... Issues Events
--
begin
null;
end;
/
--
prompt ... Issues Notifications
--
begin
null;
end;
/
 
prompt ... Extension Links
 
 
prompt ... Extension Grants
 
begin
wwv_flow_imp.import_end(p_auto_install_sup_obj => nvl(wwv_flow_application_install.get_auto_install_sup_obj, false)
);
commit;
end;
/
set verify on feedback on define on
prompt  ...done
