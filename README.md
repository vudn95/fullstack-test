# Fullstack Test
It seems like you have a set of instructions for setting up and deploying a full-stack application with AWS services. These instructions guide you through development and deployment stages for both backend and frontend components.

Let's break down the steps for development and deployment:

### Development Steps:

1. **Setting up Environment Variables:**
   - Copy the `.env.example` file to `.env` in both the backend and frontend folders.
   - The `.env` file typically contains environment-specific configurations, such as database URLs, API keys, etc.

2. **Start Development Servers:**
   - Run the `make start-all` command, which presumably starts both the backend and frontend servers.

3. **Access API Documentation and Web Interface:**
   - After successful execution, access the API documentation at `http://localhost:3002/docs` and the frontend web at `http://localhost:3003`.

### Deployment Steps:

#### Prerequisites:
  - Set up AWS services:
  - AWS RDS for the database.
  - AWSElasticBeanstalk or EC2ContainerRegistry for the backend service.
  - S3 bucket for hosting the frontend React web.
  - Configure IAM user permissions with necessary access (AWSElasticBeanstalk, AmazonEC2ContainerRegistryFull, S3).
  - Configure AWS CLI profile.

#### Deployment Instructions:

1. **Adjust Environment Variables:**
   - Update the variable values in the `.env` files within the backend and frontend folders. These values might change for different environments (development, production).

2. **Modify Deployment Scripts:**
   - Update variable values in the `docker/service/**/deploy.sh` scripts. These scripts likely contain deployment configurations or commands specific to your deployment setup.

3. **Deploy Backend and Frontend:**
   - Use the provided commands to deploy the backend and frontend services to AWS:
     ```
     AWS_PROFILE=default make deploy service=backend
     AWS_PROFILE=default make deploy service=frontend
     ```
     - Ensure that `AWS_PROFILE` is set according to your AWS CLI profile.
     - Replace `default` with your AWS CLI profile if it's different.

### Access Deployed Endpoints:

After successful deployment:
- Access your deployed backend API at `http://fullstack-test-api.ap-southeast-2.elasticbeanstalk.com/docs`.
- Access the deployed frontend at `http://fullstacktest-web.s3-website-ap-southeast-2.amazonaws.com/`.

These URLs should point to your live deployed applications hosted on AWS services.

Make sure to replace placeholder values like `AWS_PROFILE`, URLs, and other configurations with your actual settings and credentials. Testing these steps in a controlled environment or with staging setups before production deployment is recommended.