// import * as Realm from 'realm-web';

// import { IClient } from '../client';

// export type IChangeStock = {
//   campaign_id: string;
//   merchantProducts: {
//     merchant_id: string;
//     products: IStockChangeProduct[];
//   }[];
// };

// export type ICampaignStock<T = Realm.BSON.ObjectId> = {
//   _id: T;
//   name: string;
//   displayName: string;
//   stockInfo: IStockInfo<T>[];
// };

// export type ICampaignStockGridRow = {
//   _id: string;
//   name: string;
//   displayName: string;
//   [key: string]: number | string;
// };

// export type ICampaignUserStarts= {
//   reports_filled_count: number;
//   product_sold_count: number;
//   five_day_history: Array<number>;
//   five_day_sales_history: Array<number>;
// }
// export type ICampaignKPIMetrics = {
//   totalUnitsSold: number;
//   totalRevenueGenerated: number;
//   totalDailyRevenueTarget: number;
//   totalDailyUnitsSoldTarget: number;
//   topProductsByQuantity: [];
//   topSalesPersons: [];
//   unitsSoldPercentageFromTarget: number;
//   revenueGeneratedPercentageFromTarget: number;
// };
// export type IUserAssignedRoutes = {
//   _id: string;
//   user_id: string;
//   username: string;
//   name: string;
//   campaign_id: string;
//   latitude: string;
//   longitude: string;
//   visited: boolean;
//   assignee_id: string;
//   route_id: string;
//   routeAddress?:{
//     fullAddress: string;
//    location: {
//     coordinates: [number, number];
//    }
//     phoneNumber: string;
//     road: string;
//   }
// }

// export type IDistance = {
//   name: string;
//   distance: number | null;
//   latitude: number;
//   longitude: number;
// }

// export type IStockInfo<T> = {
//   productId: T;
//   latestStock: number;
// };

// export type IStockChangeProduct = {
//   product_id: string;
//   type: 'assign' | 'sale';
//   quantity: number;
//   notes: string;
//   images: string[];
// };

// export type IProject<T = Realm.BSON.ObjectId> = {
//   _id: T;
//   campaigns: Array<T>;
//   client_id: T;
//   createdAt: Date;
//   project_managers: Array<T>;
//   reports: Array<T>;
//   title: string;
//   updatedAt: Date;
// };

// export interface ICampaignKPIMetricsResponse {
//   totalUsersInCampaign: number;
//   daysRunning: number;
//   totalUsersCheckedInToday: number;
//   topSalesPersons: []
//   totalCampaignSales: {
//     _id: string | null; // Assuming the campaign_id is returned here; adjust the type as needed (e.g., ObjectId or string)
//     totalSales: number;
//     totalAmount: number;
//   } | null;
//   totalFilledReports: number;
//   dailyStats: {
//     sales: {
//       _id: null; // Grouped without a specific _id
//       dailySales: number;
//       dailyAmount: number;
//     } | null;
//     reports: number;
//   };
// }


// export interface SalesPersonKpi  {
//   id: string;
//   name: string;
//   email: string;
//   totalQuantitySold: number;
//   amount: number;
//   saleDate: string;
//   avatarUrl?: string;
// };

// export interface ICampaignKPIMetricsResponseUpdated {
//   totalUnitsSold: number;
//   totalRevenueGenerated: number;
//   totalDailyRevenueTarget: number;
//   totalDailyUnitsSoldTarget: number;
//   topProductsByQuantity: {
//     _id: string;
//     name: string;
//     totalQuantity: number;
//     totalRevenue: number;
//   };
//   unitsSoldPercentageFromTarget: number;
//   revenueGeneratedPercentageFromTarget: number;
//   topSalesPersons: {
//     id: string;
//     name: string;
//     email: string;
//     totalQuantitySold: number;
//     amount: number;
//     saleDate: string;
//     avatarUrl?: string;
//   };
//   totalNumberOfUsersInCampaign: number;
//   totalNumberOfUsersCheckedInToday: number;
// }


// export interface ISalesByRegion {
//   totalRevenue: number;
//   totalSales: number;
//   regionName: string | null;
// }

// export type ISalesByRegionsItem ={
//   salesByExistingRegion: ISalesByRegion[],
//   // salesByEstimatedRegion: mapboxRegionResults,
//   salesByAssignedRegion: ISalesByRegion[],
// };

// export type ISalesAnalyticsResponse = {
//   productName: string;
//   totalQuantity: number;
//   totalAmount: number;
//   salesDetails: Array<{
//     team: string; // "Default Team" if no match found
//     quantity: number;
//     amount: number;
//     regionName: string;
//     region_id: string;
//     teamName: string;
//     team_id: string;
//   }>;
// };

// export interface ITimeFrameSalesDataResponse {
//   date: string; // Assuming date is returned as a string from the aggregation
//   productId: string; // MongoDB ObjectId represented as a string
//   productName: string;
//   totalSales: number;
//   totalUnitsSold: number;
// }

// export type ICampaignTeam<T> = {
//   _id: T;
//   campaign_id: T;
//   createdAt: Date;
//   name: string;
//   regions: Array<T>;
//   teamLeads: Array<T>;
//   updatedAt: Date;
//   users: Array<T>;
// };

// export type IDraftCampaignTeam = {
//   createdAt: Date;
//   name: string;
//   regions: Array<string>;
//   teamLeads: Array<string>;
//   users: Array<string>;
// };

// export interface IAdminDashboardInventoryMetrics {
//   totalProducts: number;
//   totalStock: number;
//   averagePrice: number;
//   totalSold: number;
//   totalRatings: number;
//   totalReviews: number;
//   topProductsDetails: {
//     _id: string;
//     name: string;
//     totalAmount: number;
//   }[];
// }

// export interface ICampaignByType {
//   _id: string;
//   count: number;
// }

// export interface ITotalCheckInsPerCampaign {
//   campaignTitle: string;
//   totalCheckIns: number;
//   campaignId: string;
// }

// export interface ICampaignsPerClient {
//   numberOfCampaigns: number;
//   clientId: string;
//   clientName: string;
// }

// export interface ITopUserByCheckins {
//   userId: string;
//   userName: string;
//   userURL: string;
//   totalCheckIns: number;
// }

// export interface IAdminDashboardData {
//   totalClients: number;
//   totalCampaigns: number;
//   campaignsByType: ICampaignByType[];
//   totalCheckInsToday: number;
//   averageCheckInDuration: number;
//   totalCheckInsPerCampaign: ITotalCheckInsPerCampaign[];
//   campaignsPerClient: ICampaignsPerClient[];
//   topUsersByCheckIns: ITopUserByCheckins[];
// }

// export interface IAdminDashboardAvgAnswersPerDay {
//   avgAnswersPerDay: number;
//   reportId: number;
//   reportName: number;
// }

// export interface IAdminDashboardReportSummary {
//   totalReports: number;
//   avgResponses: number;
//   reportsByCampaign: IAdminDashboardCampaignSummary[];
//   totalFilledReports: number;
//   filledReportsByUser: IAdminDashboardUserReportSummary[];
//   avgAnswersPerDayPerReport: IAdminDashboardAvgAnswersPerDay[];
// }

// export interface IClientDashboardSummaryUpdated {
//   totalProjects: number;
//   totalActiveCampaigns: number;
//   clientDetails: IClient;
//   totalVerifiedUsers: number;
//   childrenDetails: IClient[];
// }

// interface IAdminDashboardCampaignSummary {
//   campaignId: string;
//   campaignName: string;
//   totalReports: number;
// }

// interface IAdminDashboardUserReportSummary {
//   _id: string; // Assuming _id is the user_id
//   count: number;
// }

// export type Item = {
//   _id: Realm.BSON.ObjectId;
//   isComplete: boolean;
//   owner_id: string;
//   summary: string;
// };

// export const ItemSchema = {
//   name: 'Item',
//   properties: {
//     _id: 'objectId',
//     isComplete: 'bool',
//     owner_id: 'string',
//     summary: 'string',
//   },
//   primaryKey: '_id',
// };

// // ROUTES
// export type IRoute = {
//   _id: Realm.BSON.ObjectId;
//   businessSector: string;
//   campaigns?: Array<Realm.BSON.ObjectId>;
//   createdAt: Date;
//   fullAddress: string;
//   location?: IRouteLocation;
//   phoneNumber?: string;
//   products?: IRouteProducts;
//   road?: string;
//   updatedAt: Date;
//   users: Array<Realm.BSON.ObjectId>;
// };

// export type IRouteLocation = {
//   coordinates: Array<number>;
//   type: string;
// };

// export type IRouteProducts = {
//   name: string;
//   product_id?: Realm.BSON.ObjectId;
//   quantity: number;
// };

// export interface IDashboardMetricType {
//   type: string;
//   count: number;
// }

// export interface ICampaignCheckIn {
//   campaignId: string; // Adjust if using ObjectId type
//   campaignTitle: string;
//   totalCheckIns: number;
// }

// export interface IDashboardMetrics {
//   totalCampaigns: number;
//   campaignsByType: IDashboardMetricType[];
//   totalCheckInsToday: number;
//   averageCheckInDuration: number;
//   totalCheckInsPerCampaign: ICampaignCheckIn[];
//   campaignsPerClient: ICampaignsPerClient[];
// }

// export interface IUserActivityMetrics {
//   checkins: IExtendedCheckin[];
//   summary: {
//     dailyAverageReportsFilled: number;
//     dailyAverageSales: number;
//     totalCheckins: number;
//     totalFilledReports: number;
//     totalUnitsSold: number;
//   }[];
// }

// export type ICampaign = {
//   _id: Realm.BSON.ObjectId;
//   access_code: string;
//   geo_fenced: boolean;
//   client_id: Realm.BSON.ObjectId;
//   client_name?: string;
//   createdAt: Date;
//   endDate: Date;
//   checkInTime?: Date;
//   checkOutTime?: Date;
//   hourlyRate: number;
//   inactivityTimeout: number;
//   products: Array<Realm.BSON.ObjectId>;
//   users: Array<Realm.BSON.ObjectId>;
//   project_id: Realm.BSON.ObjectId;
//   routes: Array<ICampaignRoutes>;
//   workingSchedule: Array<string>;
//   startDate: Date;
//   title: string;
//   salesKpi: {
//     totalDailyUnits: number;
//     totalDailyRevenue: number;
//   };
//   performance_kpi: {
//     total_reach: number;
//   };
//   description?: string;
//   today_checkin: number;
//   total_checkin: number;
//   type: string;
//   updatedAt: Date;
//   clientTitle?: string;
// };
// export type IRegionLocation ={
  
//     type: string;
//     coordinates: number[]
  
// }
// export type IRegion<T = Realm.BSON.ObjectId>= {
//   _id: T;
//   name: string;
//   campaign_id: string;
//   location: IRegionLocation;
//   teams: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt?: Date;
// }
// export type ITeam<T = Realm.BSON.ObjectId>= {
//   _id: T;
//   name: string;
//   campaign_id: string;
//   regions: string[];
//   teamLeads: string[];
//   users: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt?: Date;
// }

// export type ICampaignExtended = ICampaign & {
//   order: number;
//   isActive?: boolean;
// };
// export interface IReportErrorMessageDetails {
//   date: string;
//   username: string;
// }

// export interface IReportErrorDetails {
//   report_id: string;
//   question_id: string;
//   question_text: string;
//   error: string;
//   details: IReportErrorMessageDetails;
// }

// export interface IReportErrorResponse {
//   error: IReportErrorDetails[] | string;
// }

// // Exporting the generic type for operators
// export type IOperator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';

// // Exporting the Main Report Interface with Generics
// export interface IReport<T = Realm.BSON.ObjectId> {
//   _id: T;
//   title: string;
//   type?: string;
//   template_id?: T;
//   responses: number;
//   client_id: T;
//   project_id: T;
//   campaign_id: T;
//   campaign_title: string;
//   category_id: T;
//   product_id?: T;
//   questions: Array<IReportQuestion<T>>;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt?: Date | string;
// }
// export type IReportExtended = IReport & {
//   order: number;
// };

// export interface IFilledReport<T = Realm.BSON.ObjectId> {
//   _id: T;
//   answers: Array<IFilledReportsAnswer>;
//   campaign_id: T;
//   createdAt: Date;
//   report_id: T;
//   session_id: T;
//   updatedAt?: Date;
//   user_id: T;
//   userName: string;
// }

// export type IFilledReportsAnswer<T = Realm.BSON.ObjectId> = {
//   answer: string;
//   question_id: T;
//   report_id?: Realm.BSON.ObjectId;
//   question_text: string;
//   type: string;
// };

// // Exporting the Main Report Questions Interface with Generics
// export interface IReportQuestion<T = Realm.BSON.ObjectId> {
//   _id: T;
//   text: string;
//   order: number;
//   input_type: string;
//   placeholder?: string;
//   initialValue?: string;
//   options: IReportQuestionOptions;
//   productId?: string;
//   products?: IReportQuestionProducts;
//   unique: boolean;
//   updatedAt: Date;
//   dependencies?: Array<IQuestionDependency<T>>;
//   validation?: IReportQuestionValidation;
// }
// export type IReportQuestionOptions = Array<string>;
// export type IReportQuestionProducts = Array<string>;

// // Exporting the Main Dependency Interface with Generics
// export interface IQuestionDependency<T = Realm.BSON.ObjectId> {
//   questionId: T;
//   triggerValue: string;
//   operator: IOperator;
// }

// // Exporting the Main Validation Interface
// export interface IReportQuestionValidation {
//   required?: boolean;
//   minLength?: number;
//   maxLength?: number;
//   minValue?: number;
//   maxValue?: number;
//   regex?: IReportQuestionValidationRegex;
//   fileTypes?: Array<string>;
// }

// // Exporting the Regex Validation Interface
// export interface IReportQuestionValidationRegex {
//   matches?: string;
//   message?: string;
// }

// // Exporting the Draft Report Interface, inheriting from IReport with string type for IDs
// export interface IDraftReport extends IReport<string> {
//   questions: Array<IDraftReportQuestions>;
// }

// // Exporting the Draft Report Questions Interface, inheriting from IReportQuestion with string type for IDs
// export interface IDraftReportQuestions extends IReportQuestion<string> {
//   // Additional properties specific to draft questions can be added here
// }

// // Exporting the Draft Question Dependency Interface, inheriting from IQuestionDependency with string type for IDs
// export interface IDraftQuestionDependency extends IQuestionDependency<string> {
//   // Additional properties specific to draft dependencies can be added here
// }

// // Exporting the Draft Validation Interface, directly inheriting from IReportQuestionValidation as no ID type change is needed
// export interface IDraftReportQuestionsValidation extends IReportQuestionValidation {
//   // Additional properties specific to draft validation can be added here
// }

// // Exporting the Draft Regex Validation Interface, directly inheriting from IReportQuestionValidationRegex as no ID type change is needed
// export interface IDraftReportQuestionsValidationRegex extends IReportQuestionValidationRegex {
//   // Additional properties specific to draft regex validation can be added here
// }

// export const ICampaignSchema = {
//   name: 'ICampaign',
//   properties: {
//     _id: 'objectId',
//     access_code: 'string',
//     client_id: 'objectId',
//     products: 'objectId[]',
//     project_id: 'objectId',
//     routes: 'ICampaignRoutes[]',
//     title: 'string',
//     today_checkin: 'int',
//     total_checkin: 'int',
//     type: 'string',
//   },
//   primaryKey: '_id',
// };

// export type ICampaignRoutes = {
//   _id: Realm.BSON.ObjectId;
//   // checkins: Array<Realm.BSON.ObjectId>;
//   createdAt: Date;
//   routeAddress?: ICampaign_routes_routeAddress;
//   routeNumber: number;
//   totalQuantity: number;
//   updatedAt: Date;
// };

// export const ICampaign_routesSchema = {
//   name: 'ICampaignRoutes',
//   embedded: true,
//   properties: {
//     _id: 'objectId',
//     checkins: 'objectId[]',
//     createdAt: 'date',
//     routeAddress: 'ICampaign_routes_routeAddress',
//     routeNumber: 'string',
//     totalQuantity: 'int',
//     updatedAt: 'date',
//   },
// };

// export type ICampaign_routes_routeAddress = {
//   _id: Realm.BSON.ObjectId;
//   fullAddress: string;
//   location?: ICampaign_routes_routeAddress_location;
//   phoneNumber: string;
//   road: string;
// };
// export type ICampaign_routes_routeAddress_location = {
//   coordinates?: Array<number>;
//   type: string;
// };
// export const ICampaign_routes_routeAddressSchema = {
//   name: 'ICampaign_routes_routeAddress',
//   embedded: true,
//   properties: {
//     _id: 'objectId',
//     fullAddress: 'string',
//     latitude: 'string',
//     longitude: 'string',
//     phoneNumber: 'string',
//     road: 'string',
//   },
// };

// export type ICheckin = {
//   _id: Realm.BSON.ObjectId;
//   activeCheckins: Array<ICheckinsActiveCheckins>;
//   campaign_id: Realm.BSON.ObjectId;
//   checkin: Date;
//   checkout?: Date;
//   createdAt: Date;
//   sessions: Array<ICheckinsSessions>;
//   updatedAt?: Date;
//   lastActivity: Date;
//   user_id: Realm.BSON.ObjectId;
// };

// export type IExtendedCheckin = Omit<ICheckin, 'sessions'> & {
//   sessions: IExtendedCheckinSession[];
//   totalUnitsSold: number;
//   totalFilledReports: number;
//   userDetails: {
//     displayName: string;
//     phoneNumber?: string;
//     photoURL: string;
//     _id:  string;
//   }
//   displayName: string;
// };

// export type IExtendedCheckinSession = ICheckinsSessions & {
//   salesData: ISessionSaleData[];
//   reportsData: ISessionReportsData;
//   displayName?: string;
//   photoURL?: string;
// };

// export type ISessionProduct = {
//   _id: Realm.BSON.ObjectId;
//   name: string;
//   coverUrl: string;
//   price: number;
//   quantity: number;
// };
// export type IAppCheckoutProduct = {
//   _id: Realm.BSON.ObjectId;
//   quantity: number;
// };

// export type ISessionSaleData = {
//   _id: Realm.BSON.ObjectId;
//   totalUnitsSold: number;
//   products: ISessionProduct[];
// };

// export type ISessionReportsData = {
//   totalFilledReports: number;
// };

// export type ICheckinsActiveCheckins = {
//   checkin_id: Realm.BSON.ObjectId;
//   user_id: Realm.BSON.ObjectId;
// };

// export const checkinsSchema = {
//   name: 'checkins',
//   properties: {
//     _id: 'objectId',
//     ICampaign_id: 'objectId',
//     checkin: 'date',
//     checkout: 'date',
//     sessions: 'ICheckinsSessions[]',
//     user_id: 'objectId',
//   },
//   primaryKey: '_id',
// };

// export type ICheckinsSessions = {
//   end_time?: Date;
//   _id: Realm.BSON.ObjectId;
//   reports: Array<Realm.BSON.ObjectId>;
//   location: {
//     type: string;
//     coordinates: number[];
//     outlet_name: string;
//   };
//   start_time: Date;
//   stock: Array<Realm.BSON.ObjectId>;
// };

// export const ICheckinsSessionsSchema = {
//   name: 'ICheckinsSessions',
//   embedded: true,
//   properties: {
//     end_time: 'date?',
//     id: 'objectId',
//     reports: 'objectId[]',
//     start_time: 'date',
//     stock: 'objectId[]',
//   },
// };

// export type client = {
//   _id: Realm.BSON.ObjectId;
//   active: boolean;
//   client_icon: string;
//   client_plan: string;
//   createdAt: Date;
//   creator?: client_creator;
//   name: string;
//   updatedAt: Date;
//   users: Array<client_users>;
// };

// export const clientSchema = {
//   name: 'client',
//   properties: {
//     _id: 'objectId',
//     active: 'bool',
//     client_icon: 'string',
//     client_plan: 'string',
//     createdAt: 'date',
//     creator: 'client_creator',
//     name: 'string',
//     updatedAt: 'date',
//     users: 'client_users[]',
//   },
//   primaryKey: '_id',
// };

// export type client_creator = {
//   _id: Realm.BSON.ObjectId;
//   avatarUrl?: string;
//   email: string;
//   name: string;
// };

// export const client_creatorSchema = {
//   name: 'client_creator',
//   embedded: true,
//   properties: {
//     _id: 'objectId',
//     avatarUrl: 'string?',
//     email: 'string',
//     name: 'string',
//   },
// };

// export type client_users = {
//   _id?: Realm.BSON.ObjectId;
//   avatarUrl?: string;
//   dateAdded: Date;
//   email: string;
//   name?: string;
//   verified: boolean;
// };

// export const client_usersSchema = {
//   name: 'client_users',
//   embedded: true,
//   properties: {
//     _id: 'objectId?',
//     avatarUrl: 'string?',
//     dateAdded: 'date',
//     email: 'string',
//     name: 'string?',
//     verified: 'bool',
//   },
// };

// export type IUpdateInvoice<T = Realm.BSON.ObjectId> = {
//   _id: T;
//   campaign_id: T;
//   createdAt: Date;
//   discount?: number;
//   dueDate: Date;
//   invoiceFrom?: InvoiceInvoiceFrom;
//   invoiceNumber: Realm.BSON.ObjectId;
//   invoiceTo?: InvoiceInvoiceTo;
//   items: Array<invoice_items>;
//   location?: InvoiceLocation;
//   order_id?: T;
//   sent: number;
//   shipping?: number;
//   status: string;
//   subTotal: number;
//   taxes: number;
//   totalAmount: number;
//   updatedAt: Date;
// };

// export type InvoiceLocation = {
//   coordinates: Array<number>;
//   type: string;
// };

// export type InvoiceInvoiceFrom<T = Realm.BSON.ObjectId> = {
//   addressType: string;
//   client_id: T;
//   company: string;
//   email: string;
//   fullAddress: string;
//   name: string;
//   phoneNumber: string;
//   primary: boolean;
//   user_id: T;
// };

// export type InvoiceInvoiceTo = {
//   addressType?: string;
//   company?: string;
//   email?: string;
//   fullAddress?: string;
//   id?: string;
//   name: string;
//   phoneNumber?: string;
//   primary?: boolean;
// };

// export type invoice_items = {
//   description: string;
//   id: string;
//   price: number;
//   quantity: number;
//   service?: string;
//   title: string;
//   total: number;
// };

// export const invoice_itemsSchema = {
//   name: 'invoice_items',
//   embedded: true,
//   properties: {
//     description: 'string',
//     id: 'string',
//     price: 'double',
//     quantity: 'int',
//     service: 'string?',
//     title: 'string',
//     total: 'double',
//   },
// };

// export type notification = {
//   _id: Realm.BSON.ObjectId;
//   avatarUrl?: string;
//   category: string;
//   createdAt: Date;
//   isUnRead: boolean;
//   title: string;
//   type: string;
//   updatedAt: Date;
// };

// export const notificationSchema = {
//   name: 'notification',
//   properties: {
//     _id: 'objectId',
//     avatarUrl: 'string?',
//     category: 'string',
//     createdAt: 'date',
//     isUnRead: 'bool',
//     title: 'string',
//     type: 'string',
//     updatedAt: 'date',
//   },
//   primaryKey: '_id',
// };

// export type order = {
//   _id: Realm.BSON.ObjectId;
//   createdAt: Date;
//   customer?: order_customer;
//   delivery?: order_delivery;
//   discount?: number;
//   history?: order_history;
//   id?: string;
//   items: Array<order_items>;
//   orderNumber: string;
//   payment?: order_payment;
//   shipping?: number;
//   shippingAddress?: order_shippingAddress;
//   status: string;
//   subTotal: number;
//   taxes: number;
//   totalAmount: number;
//   totalQuantity: number;
// };

// export const orderSchema = {
//   name: 'order',
//   properties: {
//     _id: 'objectId',
//     createdAt: 'date',
//     customer: 'order_customer',
//     delivery: 'order_delivery',
//     discount: 'int?',
//     history: 'order_history',
//     id: 'string?',
//     items: 'order_items[]',
//     orderNumber: 'string',
//     payment: 'order_payment',
//     shipping: 'int?',
//     shippingAddress: 'order_shippingAddress',
//     status: 'string',
//     subTotal: 'double',
//     taxes: 'int',
//     totalAmount: 'double',
//     totalQuantity: 'int',
//   },
//   primaryKey: '_id',
// };

// export type order_customer = {
//   avatarUrl?: string;
//   email?: string;
//   id?: string;
//   ipAddress?: string;
//   name?: string;
// };

// export const order_customerSchema = {
//   name: 'order_customer',
//   embedded: true,
//   properties: {
//     avatarUrl: 'string?',
//     email: 'string?',
//     id: 'string?',
//     ipAddress: 'string?',
//     name: 'string?',
//   },
// };

// export type order_delivery = {
//   shipBy?: string;
//   speedy?: string;
//   trackingNumber?: string;
// };

// export const order_deliverySchema = {
//   name: 'order_delivery',
//   embedded: true,
//   properties: {
//     shipBy: 'string?',
//     speedy: 'string?',
//     trackingNumber: 'string?',
//   },
// };

// export type order_history = {
//   completionTime?: string;
//   deliveryTime?: string;
//   orderTime?: string;
//   paymentTime?: string;
//   timeline: Array<order_history_timeline>;
// };

// export const order_historySchema = {
//   name: 'order_history',
//   embedded: true,
//   properties: {
//     completionTime: 'string?',
//     deliveryTime: 'string?',
//     orderTime: 'string?',
//     paymentTime: 'string?',
//     timeline: 'order_history_timeline[]',
//   },
// };

// export type order_history_timeline = {
//   time?: string;
//   title?: string;
// };

// export const order_history_timelineSchema = {
//   name: 'order_history_timeline',
//   embedded: true,
//   properties: {
//     time: 'string?',
//     title: 'string?',
//   },
// };

// export type order_items = {
//   coverUrl?: string;
//   id?: string;
//   name?: string;
//   price?: number;
//   quantity?: number;
//   sku?: string;
// };

// export const order_itemsSchema = {
//   name: 'order_items',
//   embedded: true,
//   properties: {
//     coverUrl: 'string?',
//     id: 'string?',
//     name: 'string?',
//     price: 'double?',
//     quantity: 'int?',
//     sku: 'string?',
//   },
// };

// export type order_payment = {
//   cardNumber?: string;
//   cardType?: string;
// };

// export const order_paymentSchema = {
//   name: 'order_payment',
//   embedded: true,
//   properties: {
//     cardNumber: 'string?',
//     cardType: 'string?',
//   },
// };

// export type order_shippingAddress = {
//   fullAddress?: string;
//   phoneNumber?: string;
// };

// export const order_shippingAddressSchema = {
//   name: 'order_shippingAddress',
//   embedded: true,
//   properties: {
//     fullAddress: 'string?',
//     phoneNumber: 'string?',
//   },
// };

// export type product = {
//   _id: Realm.BSON.ObjectId;
//   available: number;
//   category: string;
//   client_id: Realm.BSON.ObjectId;
//   code: string;
//   colors: Array<string>;
//   coverUrl: string;
//   createdAt: Date;
//   description: string;
//   gender?: string;
//   images: Array<string>;
//   inventoryType: string;
//   name: string;
//   newLabel?: product_newLabel;
//   price: number;
//   priceSale?: number;
//   publish: string;
//   quantity: number;
//   ratings: Array<product_ratings>;
//   reviews: Array<product_reviews>;
//   saleLabel?: product_saleLabel;
//   sizes: Array<string>;
//   sku: string;
//   subDescription: string;
//   tags: Array<string>;
//   taxes?: number;
//   totalRatings?: number;
//   totalReviews?: number;
//   totalSold?: number;
//   updatedAt: Date;
// };

// export const productSchema = {
//   name: 'product',
//   properties: {
//     _id: 'objectId',
//     available: 'int',
//     category: 'string',
//     client_id: 'objectId',
//     code: 'string',
//     colors: 'string[]',
//     coverUrl: 'string',
//     createdAt: 'date',
//     description: 'string',
//     gender: 'string?',
//     images: 'string[]',
//     inventoryType: 'string',
//     name: 'string',
//     newLabel: 'product_newLabel',
//     price: 'double',
//     priceSale: 'double?',
//     publish: 'string',
//     quantity: 'int',
//     ratings: 'product_ratings[]',
//     reviews: 'product_reviews[]',
//     saleLabel: 'product_saleLabel',
//     sizes: 'string[]',
//     sku: 'string',
//     subDescription: 'string',
//     tags: 'string[]',
//     taxes: 'int?',
//     totalRatings: 'double?',
//     totalReviews: 'int?',
//     totalSold: 'int?',
//     updatedAt: 'date',
//   },
//   primaryKey: '_id',
// };

// export type productReview = {
//   _id: Realm.BSON.ObjectId;
//   avatarUrl?: string;
//   comment?: string;
//   helpful?: number;
//   isPurchased: boolean;
//   name: string;
//   postedAt: Date;
//   product_id: Realm.BSON.ObjectId;
//   rating: number;
// };

// export const productReviewSchema = {
//   name: 'productReview',
//   properties: {
//     _id: 'objectId',
//     avatarUrl: 'string?',
//     comment: 'string?',
//     helpful: 'int?',
//     isPurchased: 'bool',
//     name: 'string',
//     postedAt: 'date',
//     product_id: 'objectId',
//     rating: 'int',
//   },
//   primaryKey: '_id',
// };

// export type product_newLabel = {
//   content?: string;
//   enabled?: boolean;
// };

// export const product_newLabelSchema = {
//   name: 'product_newLabel',
//   embedded: true,
//   properties: {
//     content: 'string?',
//     enabled: 'bool?',
//   },
// };

// export type product_ratings = {
//   name?: string;
//   reviewCount?: number;
//   starCount?: number;
// };

// export const product_ratingsSchema = {
//   name: 'product_ratings',
//   embedded: true,
//   properties: {
//     name: 'string?',
//     reviewCount: 'int?',
//     starCount: 'int?',
//   },
// };

// export type product_reviews = {
//   attachments: Array<string>;
//   avatarUrl?: string;
//   comment?: string;
//   helpful?: number;
//   id?: string;
//   isPurchased?: boolean;
//   name?: string;
//   postedAt?: Date;
//   rating?: number;
// };

// export const product_reviewsSchema = {
//   name: 'product_reviews',
//   embedded: true,
//   properties: {
//     attachments: 'string[]',
//     avatarUrl: 'string?',
//     comment: 'string?',
//     helpful: 'int?',
//     id: 'string?',
//     isPurchased: 'bool?',
//     name: 'string?',
//     postedAt: 'date?',
//     rating: 'double?',
//   },
// };

// export type product_saleLabel = {
//   content?: string;
//   enabled?: boolean;
// };

// export const product_saleLabelSchema = {
//   name: 'product_saleLabel',
//   embedded: true,
//   properties: {
//     content: 'string?',
//     enabled: 'bool?',
//   },
// };

// export type projects = {
//   _id: Realm.BSON.ObjectId;
//   ICampaigns: Array<Realm.BSON.ObjectId>;
//   client_id: Realm.BSON.ObjectId;
//   createdAt: Date;
//   reports: Array<Realm.BSON.ObjectId>;
//   title: string;
//   updatedAt: Date;
// };

// export const projectsSchema = {
//   name: 'projects',
//   properties: {
//     _id: 'objectId',
//     ICampaigns: 'objectId[]',
//     client_id: 'objectId',
//     createdAt: 'date',
//     reports: 'objectId[]',
//     title: 'string',
//     updatedAt: 'date',
//   },
//   primaryKey: '_id',
// };

// export type report = {
//   _id: Realm.BSON.ObjectId;
//   ICampaign_id: Realm.BSON.ObjectId;
//   client_id: Realm.BSON.ObjectId;
//   createdAt: Date;
//   project_id: Realm.BSON.ObjectId;
//   questions: number;
//   responses: number;
//   title: string;
//   updatedAt: Date;
// };

// export const reportSchema = {
//   name: 'report',
//   properties: {
//     _id: 'objectId',
//     ICampaign_id: 'objectId',
//     client_id: 'objectId',
//     createdAt: 'date',
//     project_id: 'objectId',
//     questions: 'int',
//     responses: 'int',
//     title: 'string',
//     updatedAt: 'date',
//   },
//   primaryKey: '_id',
// };

// export type stock = {
//   _id: Realm.BSON.ObjectId;
//   capacity: number;
//   company_id: Realm.BSON.ObjectId;
//   date_added: Date;
//   end_stock: number;
//   images: Array<string>;
//   inventoryType: string;
//   merchant_id: Realm.BSON.ObjectId;
//   name: string;
//   product_id: Realm.BSON.ObjectId;
//   start_stock: number;
//   supply_point_id?: Realm.BSON.ObjectId;
// };

// export const stockSchema = {
//   name: 'stock',
//   properties: {
//     _id: 'objectId',
//     capacity: 'int',
//     company_id: 'objectId',
//     date_added: 'date',
//     end_stock: 'int',
//     images: 'string[]',
//     inventoryType: 'string',
//     merchant_id: 'objectId',
//     name: 'string',
//     product_id: 'objectId',
//     start_stock: 'int',
//     supply_point_id: 'objectId?',
//   },
//   primaryKey: '_id',
// };

// export type user = {
//   _id: Realm.BSON.ObjectId;
//   about?: string;
//   address?: string;
//   ICampaigns: Array<Realm.BSON.ObjectId>;
//   city: string;
//   clients: Array<Realm.BSON.ObjectId>;
//   company: string;
//   country: string;
//   createdAt: Date;
//   displayName: string;
//   email: string;
//   firstname: string;
//   isPublic: boolean;
//   isRegistered: boolean;
//   isVerified: boolean;
//   lastname: string;
//   phoneNumber: string;
//   photoURL: string;
//   reports: Array<Realm.BSON.ObjectId>;
//   role: string;
//   state: string;
//   status: string;
//   updatedAt: Date;
//   user_id: string;
//   zipCode?: string;
// };

// export const userSchema = {
//   name: 'user',
//   properties: {
//     _id: 'objectId',
//     about: 'string?',
//     address: 'string?',
//     ICampaigns: 'objectId[]',
//     city: 'string',
//     clients: 'objectId[]',
//     company: 'string',
//     country: 'string',
//     createdAt: 'date',
//     displayName: 'string',
//     email: 'string',
//     firstname: 'string',
//     isPublic: 'bool',
//     isRegistered: 'bool',
//     isVerified: 'bool',
//     lastname: 'string',
//     phoneNumber: 'string',
//     photoURL: 'string',
//     reports: 'objectId[]',
//     role: 'string',
//     state: 'string',
//     status: 'string',
//     updatedAt: 'date',
//     user_id: 'string',
//     zipCode: 'string?',
//   },
//   primaryKey: '_id',
// };
