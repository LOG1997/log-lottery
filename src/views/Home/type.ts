export enum LotteryStatus {
    init = 0,
    ready = 1,
    running = 2,
    end = 3,
}
export interface TargetType {
    grid: any[]
    helix: any[]
    table: any[]
    sphere: any[]
}
