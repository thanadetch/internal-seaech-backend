export interface PsListingResponse {
    data: PsListing[];
    total: number;
    page: number;
    perPage: number;
    searchTitle: string;
}

export interface PsListing {
    availability: string;
    cdnImages: CDNImage[];
    floorLevel?: number;
    floorSize: number;
    id: number;
    listingType: ListingType;
    numberOfBedRooms: string;
    numberOfBathrooms: string;
    postBy: PostBy;
    project: null | string;
    propertyId: string;
    propertyType: PropertyType;
    propertyTypeEnum: PropertyTypeEnum;
    rentalPrice: string;
    salePrice: string;
    status: AvailableFrom;
    tenure: Tenure;
    totalDuplicateInCluster: number | null;
    unavailableEndDate: null;
    unitType: string;
    unitNumber: string;
    landArea: number | null;
    gpsLat: number;
    gpsLong: number;
    title: Title;
    description: string;
    address: Address;
    availabilitySubClusterId: number;
    duplicateStatus: boolean;
    duplications: Duplication[];
    featureImageItemUrl: string;
    aeManEventResult: AEManEventResult;
    aeManEventType: string;
    aeManRentsellSpecific: null;
    aeManEventDate: Date;
    availabilityCheckText: string;
    nearestTransport?: string;
    nearestTransportDistanceMeter?: number;
    hasEmail: boolean;
    createdAt: string;
    pricePerSQM: string;
    buildingYear?: number;
    availableFrom: AvailableFrom;
    exclusivity: null;
    commercialPropertyType: null;
    dupInternal: number | null;
    dupSubClusterId: DupSubClusterID | null;
    saleType: null | string;
    subclusterRentPriceInfo: AvailableFrom;
    subclusterSalePriceInfo: AvailableFrom;
    requiredAvailabilityCheck?: boolean;
    sortingScore?: string;
    datasource?: string;
    listingProvider?: null | string;
    listingSource?: string;
}

export interface Address {
    province: string;
    district: string;
    subdistrict: null | string;
    neighborhood: null | string;
    street: string;
    postcode: string;
}

export enum AEManEventResult {
    Available = "available",
    Unavailable = "unavailable",
}

export enum Availability {
    Available = "available",
    NoInformation = "no-information",
    Rented = "rented",
}

export enum AvailableFrom {
    Active = "Active",
    Duplicate = "Duplicate",
    Empty = "-",
}

export interface CDNImage {
    isPublished: boolean;
    exterior: Exterior | null;
    imageScore: number | null;
    alt: null | string;
    caption: null;
    id: number;
    roomType: RoomType | null;
    resizeImages: ResizeImage[];
}

export enum Exterior {
    Building = "building",
    Empty = "",
    Entrance = "entrance",
    Garden = "garden",
    Gym = "gym",
    Pool = "pool",
    View = "view",
}

export interface ResizeImage {
    size: number;
    url: string;
}

export enum RoomType {
    Balcony = "balcony",
    Bathroom = "bathroom",
    Bedroom = "bedroom",
    Empty = "",
    Kitchen = "kitchen",
    Livingroom = "livingroom",
    Other = "other",
    Storage = "storage",
}

export enum DupSubClusterID {
    The10354_RentTwoBedrooms = "10354_rent_two_bedrooms",
    The214_RentOneBedroom = "214_rent_one_bedroom",
    The510_RentOneBedroom = "510_rent_one_bedroom",
}

export interface Duplication {
    availability: Availability;
    cdnImages: CDNImage[];
    floorLevel?: number;
    floorSize: number;
    id: number;
    listingType: ListingType;
    numberOfBedRooms: string;
    numberOfBathrooms: string;
    postBy: PostBy;
    project: string;
    propertyId: string;
    propertyType: PropertyType;
    propertyTypeEnum: PropertyTypeEnum;
    rentalPrice: string;
    salePrice: AvailableFrom;
    status: AvailableFrom;
    tenure: Tenure;
    totalDuplicateInCluster: number;
    unavailableEndDate: null;
    unitType: string;
    unitNumber: AvailableFrom;
    landArea: number;
    gpsLat: number;
    gpsLong: number;
    title: Title;
    description: string;
    address: Address;
    availabilitySubClusterId: number;
    duplicateStatus: boolean;
    duplications: any[];
    featureImageItemUrl: string;
    aeManEventResult: AEManEventResult;
    aeManEventType: AEManEventType;
    aeManRentsellSpecific: string;
    aeManEventDate: Date;
    availabilityCheckText: string;
    nearestTransport: string;
    nearestTransportDistanceMeter: number;
    hasEmail: boolean;
    createdAt: string;
    pricePerSQM: AvailableFrom;
    buildingYear: number;
    availableFrom: AvailableFrom;
    exclusivity: string;
    commercialPropertyType: string;
    dupInternal: number;
    dupSubClusterId: DupSubClusterID;
    saleType: string;
    sortingScore: string;
    subclusterRentPriceInfo: AvailableFrom;
    subclusterSalePriceInfo: AvailableFrom;
    datasource: string;
    listingProvider: string;
    listingSource: string;
}

export enum AEManEventType {
    CobrokerFeedback = "cobroker_feedback",
    LandlordFeedback = "landlord_feedback",
    LinkAvailable = "link_available",
}

export enum ListingType {
    Rent = "Rent",
    RentSell = "Rent/Sell",
    Sell = "Sell",
}


export enum PostBy {
    Agent = "agent",
    Landlord = "landlord",
}


export enum PropertyType {
    Condo = "Condo",
    Duplex = "Duplex",
    House = "House",
}

export enum PropertyTypeEnum {
    Condo = "condo",
    Duplex = "duplex",
    House = "house",
}


export enum Tenure {
    Rent = "rent",
    Rentsell = "rentsell",
    Sell = "sell",
}

export interface Title {
    browser: string;
    short: string;
    standard: string;
}

