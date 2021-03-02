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
