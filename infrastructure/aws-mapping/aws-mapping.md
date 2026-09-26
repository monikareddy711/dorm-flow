# Cloud Architecture Equivalence: Azure to AWS

DormFlow Aachen is primarily designed with an Azure cloud-native target architecture, but was architected following cloud-agnostic standards. The table below details the architectural mapping between Microsoft Azure and Amazon Web Services (AWS):

| Architectural Component | Azure Implementation | AWS Equivalent Service | Operational Rationale & Trade-offs |
| :--- | :--- | :--- | :--- |
| **Container Orchestration** | **Azure Kubernetes Service (AKS)** | **Amazon Elastic Kubernetes Service (EKS)** | Both provide managed Kubernetes control planes with automated patching and node auto-scaling. AKS integrates seamlessly with Entra ID; EKS uses IAM Roles for Service Accounts (IRSA). |
| **Container Registry** | **Azure Container Registry (ACR)** | **Amazon Elastic Container Registry (ECR)** | Private OCI-compliant image registries with vulnerability scanning and vulnerability webhooks connected to CI/CD pipelines. |
| **Relational Database** | **Azure Database for PostgreSQL (Flexible Server)** | **Amazon RDS for PostgreSQL** | Managed relational service with automated daily backups, read replicas, automated maintenance windows, and SSL encryption in transit. Eliminates managing DB storage on raw worker nodes. |
| **Secret Management** | **Azure Key Vault** | **AWS Secrets Manager / AWS SSM Parameter Store** | Secure hardware-backed storage for JWT secrets, database connection URIs, and TLS private keys without committing plaintext secrets to Git. |
| **Observability & APM** | **Azure Monitor & Application Insights** | **Amazon CloudWatch & AWS X-Ray** | Aggregates structured JSON logs, container stdout/stderr, correlation ID tracing across distributed microservices, and latency alerts. |
| **Static Assets & Attachments** | **Azure Blob Storage** | **Amazon Simple Storage Service (S3)** | Object storage with pre-signed URLs for optional photo attachments of damaged fixtures or heating pipes. |
| **Ingress & TLS Termination** | **Azure Application Gateway / NGINX Ingress** | **AWS Application Load Balancer (ALB) via AWS Load Balancer Controller** | SSL offloading with Let's Encrypt / AWS Certificate Manager (ACM) and HTTP-to-HTTPS redirect. |

## Migration Notes
The Kubernetes manifests (`/infrastructure/kubernetes/`) and Dockerfiles are completely standard and portable between AKS and EKS without modifying container code or configuration.
