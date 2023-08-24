
/**
 * The generic packet class to send things to the server.
 * @author sourcemile
 *
 * @class PacketRequest
 * @typedef {PacketRequest}
 * @param t The UNIX timestamp in ms at the time of sending
 * @param args A dictionary with key-value pairs.
 */

interface IPacket {
    t: number
}

class MousePacket implements IPacket {
    t: number
    x: number
    y: number
    constructor(t: number, x: number, y: number) {
        this.t = t
        this.x = x
        this.y = y
    }
}

class WalkPacket implements IPacket {
    t: number
    x: number
    y: number
    z: number
    constructor(
        t: number,
        x: number,
        y: number,
        z: number
    ) {
        this.t = t
        this.x = x
        this.y = y
        this.z = z
    }
}

class AttackPacket implements IPacket {
    t: number
    target: number
    constructor(t: number, target: number) {
        this.t = t
        this.target = target
    }
}

class TradeWithPacket implements IPacket {
    t: number
    target: number
    constructor(t: number, target: number) {
        this.t = t
        this.target = target
    }
}

class ExaminePacket implements IPacket {
    t: number
    target: number
    constructor(t: number, target: number) {
        this.t = t
        this.target = target
    }
}

class EquipItemPacket implements IPacket {
    t: number
    item: number
    slot: number
    constructor(t: number, item: number, slot: number) {
        this.t = t
        this.item = item
        this.slot = slot
    }
}

class UnequipItemPacket implements IPacket {
    t: number
    slot: number
    constructor(t: number, slot: number) {
        this.t = t
        this.slot = slot
    }
}