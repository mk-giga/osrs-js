class EntityAction {
    action;
    constructor(action) {
        this.action = action;
    }
}

class EntityActionPacket {
    constructor(t, action) {
        this.t = t; // time of sending the packet
        this.action = action;
    }
}

const entityActions = {
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