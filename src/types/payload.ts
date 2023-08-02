export interface Payload {
    tokenId: string
    sessionId: number
    userId: number
    roleId: number
    username: string
    name: string
    lastActivity: number
    issuedAt: number
    ip?: string
}


export interface POSPayload {
    tokenId: string
    userId: number
    roleId: number
    sessionId: number
    email: string
    posId: number
    lastActivity: number
    issuedAt: number
    ip?: string
}
