- frontend: angular 19, angular material
- backend: spring boot
  - use Java's SDK to handle API calls for cards, documentation can be found under: https://github.com/MagicTheGathering/mtg-sdk-java
- database: postgresql on AWS RDS
- authentication: amazon cognito
- CI/CD: services from AWS

The frontend and backend are stored in separate projects. The backend uses the magicthegathering.io API to retrieve card data, documentation link: https://docs.magicthegathering.io/#documentationgetting_started