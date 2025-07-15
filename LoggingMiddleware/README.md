# Logging Middleware

This file contains a production-grade logging middleware using Axios to send logs to a remote service.

## Usage

- `log(stack, level, package, message)`  
- Automatically includes Bearer token and sends logs to:  
  `http://20.244.56.144/evaluation-service/logs`
