import { Server } from 'socket.io';
export declare const setupSocketIO: (io: Server) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const sendNotificationToUser: (io: Server, userId: string, notification: any) => void;
export declare const broadcastAnnouncement: (io: Server, announcement: any) => void;
//# sourceMappingURL=socketHandlers.d.ts.map