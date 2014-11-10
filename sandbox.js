/**
 * Created by Karl on 09/11/2014.
 */
var ModUtils = ModUtils || {};


ModUtils.setAttribute = function(char_id, attr_name, newVal) {
    var attribute = findObjs({
        _type: "attribute",
        _characterId: char_id,
        _name: attr_name
    })[0];

    //log(attribute);
    if (attribute == undefined) {
        createObj("attribute", {
            name: attr_name,
            current: newVal,
            characterId: char_id
        });
    } else {
        attribute.set("current", newVal.toString());
    }
    //log(attribute);
};

ModUtils.decrementAttribute = function(char_id, attr_name, curVal) {
    var attribute = findObjs({
        _type: "attribute",
        _characterId: char_id,
        _name: attr_name
    })[0];

    if (attribute == undefined) {
        ModUtils.setAttribute(char_id, attr_name, -1);
        return;
    }
    //log(attribute);
    attribute.set("current", (parseInt(curVal) - 1).toString());
    //log(attribute);
};

ModUtils.incrementAttribute = function(char_id, attr_name, curVal) {
    var attribute = findObjs({
        _type: "attribute",
        _characterId: char_id,
        _name: attr_name
    })[0];

    if (attribute == undefined) {
        ModUtils.setAttribute(char_id, attr_name, 1);
        return;
    }
    //log(attribute);
    attribute.set("current", (parseInt(curVal) + 1).toString());
    //log(attribute);
};

ModUtils.alterAttribute = function(char_id, attr_name, modVal) {
    var attribute = findObjs({
        _type: "attribute",
        _characterId: char_id,
        _name: attr_name
    })[0];

    if (attribute == undefined) {
        ModUtils.setAttribute(char_id, attr_name, modVal);
        return;
    }
    //log(attribute);
    attribute.set("current", (parseInt(attribute.get("current")) + modVal).toString());
    //log(attribute);
};

ModUtils.alterBar = function(tokenID, barNum, modVal) {
    var token = getObj("graphic", tokenID);
    if (token == undefined || barNum < 1 && barNum > 3) return;

    var bar = "bar" + barNum;
    var barVal = parseInt(token.get(bar + "_value"));
    var barMax = parseInt(token.get(bar + "_max"));
    barVal += modVal;

    if (barVal > barMax) barVal = barMax;

    token.set(bar + "_value", barVal);
};

on("chat:message", function (msg) {
    //log(msg.content);
    if (msg.type != "api") return;

    var args = msg.content.split(" ");
    var command = args.shift();
    var token = null;
    var char_id = "";
    var attr_name = "";
    var curVal = "";
    if (command === "!attributeDown") {
        token = getObj("graphic", args[0]);
        char_id = token.get("represents");
        if (char_id != "") {
            attr_name = args[1];
            curVal = getAttrByName(char_id, attr_name);

            //log(!char_id);
            //log(attr_name);
            //log(curVal);

            ModUtils.decrementAttribute(char_id, attr_name, curVal);
        }
    } else if (command === "!attributeUp") {
        token = getObj("graphic", args[0]);
        char_id = token.get("represents");
        if (char_id != "") {
            attr_name = args[1];
            curVal = getAttrByName(char_id, attr_name);

            //log(char_id);
            //log(attr_name);
            //log(curVal);

            ModUtils.incrementAttribute(char_id, attr_name, curVal);
        }
    } else if (command === "!alterAttribute") {
        token = getObj("graphic", args[0]);
        char_id = token.get("represents");
        if (char_id != "") {
            attr_name = args[1];
            var modVal = args[2];
            modVal = parseInt(modVal);

            //log(char_id);
            //og(attr_name);
            //log(modVal);

            ModUtils.alterAttribute(char_id, attr_name, modVal);
        }
    } else if (command === "!setAttribute") {
        token = getObj("graphic", args[0]);
        char_id = token.get("represents");
        if (char_id != "") {
            attr_name = args[1];
            var newVal = args[2];

            //log(char_id);
            //log(attr_name);
            //log(newVal);

            ModUtils.setAttribute(char_id, attr_name, newVal);
        }
    } else if(command === "!setTint") {
        token = getObj("graphic", args[0]);
        var color = args[1];

        //log(color);

        token.set("tint_color", color);
    } else if (command === "!addTracker") {
        var turnorder = JSON.parse(Campaign().get("turnorder"));

        token = getObj("graphic", args[0]);
        char_id = token.get("represents");
        var rounds = args[1];
        var condition = args[2];
        var CUorCD = args[3];

        log(turnorder);
        log(char_id);
        log(rounds);
        log(condition);
        log(CUorCD);

        if (char_id != "") {
            turnorder.push({
                id: "-1",
                pr: rounds,
                custom: token.get("name") + "\'s " + condition + "|" + CUorCD
            });
            Campaign().set("turnorder", JSON.stringify(turnorder));
        }
        log(turnorder);
    } else if (command === "!decrementAttributeForSelected") {
        attr_name = args[0];

        _.each(msg.selected, function(selected) {
            //log(selected)
            var char_id = getObj("graphic", selected._id).get("represents");
            if (char_id != "") {
                var curVal = getAttrByName(char_id, attr_name);

                //log(char_id);
                //log(attr_name);
                //log(curVal);

                ModUtils.decrementAttribute(char_id, attr_name, curVal);
            }
        });
    } else if (command === "!increaseAttributeForSelected") {
        attr_name = args[0];

        _.each(msg.selected, function(selected) {
            //log(selected)
            var char_id = getObj("graphic", selected._id).get("represents");
            if (char_id != "") {
                var curVal = getAttrByName(char_id, attr_name);

                //log(char_id);
                //log(attr_name);
                //log(curVal);

                ModUtils.incrementAttribute(char_id, attr_name, curVal);
            }
        });
    }
});