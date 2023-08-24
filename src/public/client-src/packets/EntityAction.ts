class EntityAction {
    action: number
    constructor(action: number) {
        this.action = action;
    }
}

class EntityActionPacket {
    t: number
    action: EntityActions
    constructor(t: number, action: EntityActions) {
        this.t = t; // time of sending the packet
        this.action = action;
    }
}

enum EntityActions {
    WALK_HERE,
    ATTACK,
    EXAMINE,
    TRADE_WITH,
    EMOTE,
    PRAYER_ON,
    PRAYER_OFF,
    RUN_ON,
    RUN_OFF,
    EQUIP_ITEM,
    UNEQUIP_ITEM,
    USE_ITEM_ON_ITEM,
    USE_ITEM_ON_CHARACTER,
    USE_ITEM_ON_OBJECT
}