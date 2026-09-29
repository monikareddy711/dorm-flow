# ADR-007: Azure as the Primary Cloud Provider with AWS Equivalence Mapping

## Status
Accepted

## Context
Deploying enterprise microservices requires cloud-native infrastructure including container registry, managed Kubernetes, managed database, and secret management. 

## Decision
- Implement Azure as the target deployment provider using Azure Bicep (`main.bicep`):
  - Azure Container Registry (ACR)
  - Azure Kubernetes Service (AKS)
  - Azure Database for PostgreSQL Flexible Server
  - Azure Key Vault
  - Azure Monitor / Application Insights
- Maintain a comprehensive AWS Equivalence Mapping document (`/infrastructure/aws-mapping/aws-mapping.md`) mapping each component to AWS EKS, ECR, RDS, Secrets Manager, and CloudWatch.

## Consequences
- Concrete implementation without falsely claiming multi-cloud dual deployments.
