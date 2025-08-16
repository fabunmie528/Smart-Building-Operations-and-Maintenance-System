# Smart Building Operations and Maintenance System

A comprehensive blockchain-based system for managing smart building operations, energy monitoring, maintenance scheduling, billing automation, and tenant services using Clarity smart contracts.

## System Overview

This system provides a decentralized solution for building management that includes:

- **Building Registry**: Central registration and management of building properties
- **Energy Monitoring**: Real-time tracking of energy consumption and system performance
- **Maintenance Scheduler**: Automated scheduling and service provider management
- **Billing System**: Transparent automated billing for utilities and shared services
- **Tenant Services**: Amenity booking and tenant service management

## Architecture

The system consists of five interconnected smart contracts:

### 1. Building Registry (`building-registry.clar`)
- Registers and manages building properties
- Tracks building owners and authorized managers
- Maintains building metadata and configuration

### 2. Energy Monitoring (`energy-monitoring.clar`)
- Records energy consumption data from IoT sensors
- Calculates efficiency metrics and performance indicators
- Provides historical energy usage analytics

### 3. Maintenance Scheduler (`maintenance-scheduler.clar`)
- Manages maintenance schedules and tasks
- Handles service provider registration and access control
- Tracks maintenance history and completion status

### 4. Billing System (`billing-system.clar`)
- Automates utility billing based on consumption data
- Manages shared service charges and cost allocation
- Provides transparent billing records and payment tracking

### 5. Tenant Services (`tenant-services.clar`)
- Handles amenity booking and reservation systems
- Manages tenant service requests and fulfillment
- Tracks tenant satisfaction and service quality metrics

## Key Features

### Transparency & Trust
- All operations recorded on blockchain for immutable audit trail
- Real-time access to building performance and cost data
- Transparent billing with detailed consumption breakdowns

### Automation
- Automated billing based on actual consumption
- Smart maintenance scheduling based on usage patterns
- Intelligent resource allocation and optimization

### Access Control
- Role-based permissions for building managers, service providers, and tenants
- Secure service provider access with time-limited permissions
- Tenant privacy protection with selective data sharing

### Cost Efficiency
- Optimized energy usage through performance monitoring
- Predictive maintenance to reduce emergency repairs
- Shared service cost allocation based on actual usage

## Data Types

### Building Data
- Building ID, address, and property details
- Owner and manager information
- System specifications and capacity

### Energy Data
- Consumption readings by meter and time period
- Efficiency ratings and performance benchmarks
- Cost calculations and billing allocations

### Maintenance Data
- Scheduled and completed maintenance tasks
- Service provider credentials and access logs
- Equipment status and replacement schedules

### Billing Data
- Utility consumption and charges
- Shared service allocations
- Payment records and outstanding balances

### Tenant Data
- Amenity reservations and usage history
- Service requests and completion status
- Satisfaction ratings and feedback

## Getting Started

1. Deploy contracts in order: building-registry → energy-monitoring → maintenance-scheduler → billing-system → tenant-services
2. Register your building using the building registry
3. Configure energy monitoring endpoints
4. Set up maintenance schedules and service providers
5. Initialize billing parameters and tenant services

## Testing

Run the test suite with:
\`\`\`bash
npm test
\`\`\`

Tests cover all contract functions, error conditions, and integration scenarios.

## Security Considerations

- All sensitive operations require proper authorization
- Input validation prevents malicious data injection
- Time-based access controls for service providers
- Tenant data privacy protection mechanisms
