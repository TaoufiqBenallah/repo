# Salesforce SME DAT integration
https://cda.rbinternational.corp/cds/#studio/product/cia-salesforce/release/1.0.0/tab/assetsAndAttachedSourcesMgmt/attachedSource/cia-rcis-salesforce-sme-dat/alias/salesforce-rbko-sme-dat/subtab/attachedSourceDataTab

## Need to create secrets in AWS parameter store
```
/Config/${ENVIRONMENT_NAME}/${CDA_COMPONENT_ALIAS}/jwt
/Config/${ENVIRONMENT_NAME}/${CDA_COMPONENT_ALIAS}/jwt_customer_key
/Config/${ENVIRONMENT_NAME}/${CDA_COMPONENT_ALIAS}/sfmc_client_id
/Config/${ENVIRONMENT_NAME}/${CDA_COMPONENT_ALIAS}/sfmc_client_secret
/Config/${ENVIRONMENT_NAME}/${CDA_COMPONENT_ALIAS}/sme_dat_api_client_id
/Config/${ENVIRONMENT_NAME}/${CDA_COMPONENT_ALIAS}/sme_dat_api_client_secret
```

## Component Environment Settings

### Default
```
CDA_EXTRACT_HOST=${DEPLOYMENT_SERVER_HOST}
CDA_EXTRACT_USER=${CDA_USER}
CDA_EXTRACT_PATH=${HOME}/${CDA_ENVIRONMENT}/${CDA_COMPONENT_NAME}
CDA_SCRIPT_PATH="${CDA_EXTRACT_PATH}/deploy.sh"
CDA_SCRIPT_HOST=${CDA_EXTRACT_HOST}
CDA_SCRIPT_USER=${CDA_EXTRACT_USER}
```

### RDS specific parameters
```
DBClass=db.t3.micro
DBUser=sme_dat
DBAllocatedStorage=30
DBName=sme_dat
MajorPostgresVersion=11
MultiAZDatabase=false
PreferredBackupWindow=06:30-07:30
PreferredMaintenanceWindow=Fri:16:30-Fri:17:30
Schedule=vie-office-hours #[resource_tags]
```

### ElasticCache for Redis specific parameters
```
ClusterNodeType=cache.t3.micro
CacheNumNodes=1
```

### APIGW specific parameters
```
APIENV_TARGET_ENDPOINT=internal-connect.${ENVIRONMENT_ZONE_LOWER}.merlinplatform.cloud:30008
APIENV_VPCLINK=k82yrh
AddCustomDomainName=true
ApiCustomDomainName=${CDA_COMPONENT_ALIAS}
```

### WAF specific parameters
```
WafACLName=${CDA_COMPONENT_ALIAS}
WafACLName=${CDA_COMPONENT_ALIAS}
FullWafACLName=${CDA_COMPONENT_ALIAS}
WebAclScope=REGIONAL
IPAddressWhitelist=217.13.183.0/24,193.110.28.0/24,161.71.32.0/24
WafEnabled=true
ExcludeCommon=NoUserAgent_HEADER
```

### EKS Specific Parameters
```
ContainerPlatform=EKS
NexusImageUrl=docker.rbinternational.corp/${CDA_COMPONENT_NAME}:${CDA_COMPONENT_NEW_VERSION}
DesiredServiceSize=1
MinServiceSize=1
MaxServiceSize=4
ServiceName=${CDA_COMPONENT_ALIAS}
ServiceType=Private
DockerContainerPort=3000
HealthCheckEndpoint=/mgmt/health
HttpCodeMax=299
MaxMemory=50
Metrics=false
```

### Container specific parameters
```
BATCH_LIMIT=100 #[env_vars]
DATA_EXTENSION_SEND_LOG= #[env_vars]
DOMAIN=${ServiceName}.${ENVIRONMENT_ZONE_LOWER}.merlinplatform.cloud #[env_vars]
POSTGRES_HOST=rds-${CDA_COMPONENT_ALIAS}-${EnvironmentNameLower}.${ENVIRONMENT_ZONE_LOWER}.merlin #[env_vars]
POSTGRES_PORT=5432 #[env_vars]
POSTGRES_USER=${DBUser} #[env_vars]
POSTGRES_DATABASE=${DBName} #[env_vars]
PORT=3000 #[env_vars]
REDIS_HOST=cache-${CDA_COMPONENT_ALIAS}-${EnvironmentNameLower}.${ENVIRONMENT_ZONE_LOWER}.merlin #[env_vars]
REDIS_PORT=6379 #[env_vars]
RUN_MIGRATIONS=true #[env_vars]
SFMC_ACCOUNT_ID=510001491 #[env_vars]
SFMC_SUBDOMAIN=mcgxznpctbrgw15m04wk76cmsg18 #[env_vars]
STACK=s50 #[env_vars]
SME_DAT_API_URL=https://rat-awsapi-dev97.ccsi-test.merlinplatform.cloud #[env_vars]
```

### Other parameters
```
Stream=RBKO #[resource_tags]
NWU=RBKO #[resource_tags]
```
