
/**
 * The generic packet class to send things to the server.
 * @author sourcemile
 *
 * @class PacketRequest
 * @typedef {PacketRequest}
 * @param t The UNIX timestamp in ms at the time of sending
 * @param args A dictionary with key-value pairs.
 */

interface Packet {
    t: number
}

class MousePacket implements Packet {
    t: number
    x: number
    y: number
}

class WalkPacket implements Packet {
    t: number
    x: number
    y: number
    z: number
}

class TradeWithPacket implements Packet {
    t: number
    target: number
}

class ExaminePacket implements Packet {
    t: number
    target: number
}

class EquipItemPacket implements Packet {
    t: number
    item: number
    slot: number
}

class UnequipItemPacket implements Packet {
    t: number
    slot: number
}