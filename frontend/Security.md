# Avoiding abusive traffic

Monitoring usage as % of daily quota: https://console.cloud.google.com/appengine/quotadetails?project=mcgillrtc-474ff&folder&organizationId 

Monitoring (graphically) and editing rules: https://console.firebase.google.com/u/0/project/mcgillrtc-474ff/firestore/rules 

Set up an altering policy: https://console.cloud.google.com/monitoring/alerting/policies/create?project=mcgillrtc-474ff

Setting up cloud monitoring: https://cloud.google.com/monitoring/docs/ 

This collects metrics, events, and metadata from Google Cloud, Amazon Web Services (AWS), hosted uptime probes, and application instrumentation. 
Using the BindPlane service, you can also collect this data from over 150 common application components, on-premise systems, and hybrid cloud systems. 
Google Cloud's operations suite ingests that data and generates insights via dashboards, charts, and alerts. 
BindPlane is included with your Google Cloud project at no additional cost.

Setting up scaling behaviour for instances and cloud functions: https://cloud.google.com/functions/docs/max-instances

Alerts set up on MVP release:
https://console.cloud.google.com/billing/01D769-6547F0-80EE42/budgets?organizationId=0

# API keys

Firebase uses API keys only to identify your app's Firebase project to Firebase services, and not to control access to database or Cloud Storage data, 
which is done using Firebase Security Rules.

API Key Restrictions: https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions

Our API credentials and restrictions (need to remove localhost for production):
https://console.cloud.google.com/apis/credentials?project=mcgillrtc-474ff&folder=&organizationId=

# Security Rules

When you set up Cloud Firestore, Realtime Database, and Cloud Storage, intitialize your security rules to deny all access by default, and add rules that grant access to specific resources as you develop your app.

Conditions:
https://firebase.google.com/docs/firestore/security/rules-conditions

Rules guide:
https://howtofirebase.com/firebase-security-rules-88d94606ce4a
https://www.fullstackfirebase.com/cloud-firestore/security-rules

Templates:
https://medium.com/@juliomacr/10-firebase-realtime-database-rule-templates-d4894a118a98
https://gist.github.com/codediodeio/6dbce1305b9556c2136492522e2100f6

# Authentication

Email-password authentication: set tight quota for the sign-in endpoint to prevent brute force attacks If you use Firebase's managed email-password authentication service, tighten the default quota of the identitytoolkit.googleapis.com endpoints to prevent brute force attacks. You can do so from the API's page in the Google Cloud Console.
