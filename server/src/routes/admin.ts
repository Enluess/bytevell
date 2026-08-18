import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getStats, listUsers, getUserDetails, updateUserRole, updateUserBalance, listServices, updateServiceStatus, listAllTickets, updateTicketStatus, listAllInvoices, updateInvoiceStatusAdmin, getAdminTicket, replyAdminTicket, updateUserProfile, assignManualService, deleteServiceAdmin, deleteInvoiceAdmin } from '../controllers/adminController.js';
import { listDatacenters, createDatacenter, updateDatacenter, deleteDatacenter, listServers, createServer, updateServer, deleteServer, listIpPools, createIpPool, updateIpPool, deleteIpPool, listIpAddresses, createIpAddress, updateIpAddress, deleteIpAddress } from '../controllers/adminInfrastructureController.js';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../controllers/adminProductController.js';
import { listAuditLogs, getSystemSettings, updateSystemSetting } from '../controllers/adminSystemController.js';
import { requireAdmin, requirePermission } from '../middleware/rbac.js';

export default async function adminRoutes(fastify: FastifyInstance) {
    // All routes require at least ADMIN role
    fastify.addHook('preHandler', requireAdmin);

    fastify.get('/stats', getStats);

    // Users & Customers
    fastify.register(async (userScope) => {
        userScope.addHook('preHandler', requirePermission('customers.view'));
        userScope.get('/users', listUsers);
        userScope.get('/users/:id/details', getUserDetails);
        
        userScope.put('/users/:id/role', { preHandler: requirePermission('system.manage') }, updateUserRole);
        userScope.put('/users/:id/balance', { preHandler: requirePermission('billing.edit') }, updateUserBalance);
        userScope.put('/users/:id/profile', { preHandler: requirePermission('customers.edit') }, updateUserProfile);
        userScope.post('/users/:id/services', { preHandler: requirePermission('services.edit') }, assignManualService);
    });

    // Services
    fastify.register(async (serviceScope) => {
        serviceScope.addHook('preHandler', requirePermission('services.view'));
        serviceScope.get('/services', listServices);
        serviceScope.put('/services/:id/status', { preHandler: requirePermission('services.edit') }, updateServiceStatus);
        serviceScope.delete('/services/:id', { preHandler: requirePermission('services.delete') }, deleteServiceAdmin);
    });

    // Tickets
    fastify.register(async (ticketScope) => {
        ticketScope.addHook('preHandler', requirePermission('support.view'));
        ticketScope.get('/tickets', listAllTickets);
        ticketScope.get('/tickets/:id', getAdminTicket);
        ticketScope.put('/tickets/:id/status', { preHandler: requirePermission('support.reply') }, updateTicketStatus);
        ticketScope.post('/tickets/:id/messages', { preHandler: requirePermission('support.reply') }, replyAdminTicket);
    });

    // Invoices
    fastify.register(async (invoiceScope) => {
        invoiceScope.addHook('preHandler', requirePermission('billing.view'));
        invoiceScope.get('/invoices', listAllInvoices);
        invoiceScope.put('/invoices/:id/status', { preHandler: requirePermission('billing.edit') }, updateInvoiceStatusAdmin);
        invoiceScope.delete('/invoices/:id', { preHandler: requirePermission('billing.delete') }, deleteInvoiceAdmin);
    });

    // Products
    fastify.register(async (productScope) => {
        productScope.addHook('preHandler', requirePermission('services.view'));
        productScope.get('/products', listProducts);
        productScope.post('/products', { preHandler: requirePermission('services.edit') }, createProduct);
        productScope.put('/products/:id', { preHandler: requirePermission('services.edit') }, updateProduct);
        productScope.delete('/products/:id', { preHandler: requirePermission('services.delete') }, deleteProduct);
    });

    // Infrastructure
    fastify.register(async (infraScope) => {
        infraScope.addHook('preHandler', requirePermission('infrastructure.manage'));
        
        infraScope.get('/datacenters', listDatacenters);
        infraScope.post('/datacenters', createDatacenter);
        infraScope.put('/datacenters/:id', updateDatacenter);
        infraScope.delete('/datacenters/:id', deleteDatacenter);

        infraScope.get('/servers', listServers);
        infraScope.post('/servers', createServer);
        infraScope.put('/servers/:id', updateServer);
        infraScope.delete('/servers/:id', deleteServer);

        infraScope.get('/ip-pools', listIpPools);
        infraScope.post('/ip-pools', createIpPool);
        infraScope.put('/ip-pools/:id', updateIpPool);
        infraScope.delete('/ip-pools/:id', deleteIpPool);

        infraScope.get('/ip-addresses', listIpAddresses);
        infraScope.post('/ip-addresses', createIpAddress);
        infraScope.put('/ip-addresses/:id', updateIpAddress);
        infraScope.delete('/ip-addresses/:id', deleteIpAddress);
    });

    // System & Audit
    fastify.register(async (sysScope) => {
        sysScope.addHook('preHandler', requirePermission('system.manage'));
        sysScope.get('/audit-logs', listAuditLogs);
        sysScope.get('/system-settings', getSystemSettings);
        sysScope.put('/system-settings', updateSystemSetting);
    });
}
