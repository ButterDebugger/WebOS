import { domParser, isChildOf } from "https://debutter.dev/x/js/utils.js@1.2";

export class ContextMenu {
    constructor() {
        this.ele = domParser(`<div class="context-menu gray-container"></div>`);
        this.parent = null;
        this.subnet = new Set();

        window.addEventListener("click", ({ target }) => {
            // Do not check if this context menu is the child of another
            if (this.parent) return;

            // Check if the clicked element if the child of this context menu
            let isChild = false;

            for (let menu of flattenSubnet(this)) {
                if (isChildOf(target, menu.ele)) {
                    isChild = true;
                }
            }

            if (!isChild) this.hide();
        });
    }

    spawn(x = 0, y = 0) {
        this.x = x;
        this.y = y;

        document.body.appendChild(this.ele);
    }

    hide() {
        this.subnet.forEach(menu => menu.hide());

        this.ele.remove();
    }

    addOption(name, id, submenu = null) {
        let option = domParser(`<div class="option"></div>`);

        option.innerText = name;
        option.setAttribute("data-opt-id", id);
        option.submenu = submenu;

        if (submenu instanceof ContextMenu) {
            this.subnet.add(submenu);
            submenu.parent = this;
        }

        option.addEventListener("mouseover", () => {
            this.subnet.forEach(menu => menu.hide());

            if (submenu instanceof ContextMenu) {
                let bounds = option.getBoundingClientRect();

                submenu.spawn(bounds.x + bounds.width, bounds.y);
            }
        });

        option.addEventListener("mouseout", ({ relatedTarget }) => {
            if (submenu instanceof ContextMenu) {
                if (isChildOf(relatedTarget, submenu.ele) || relatedTarget === submenu.ele) return;

                submenu.hide();
            }
        });

        this.ele.appendChild(option);
        return this;
    }

    addDivider() {
        let divider = domParser(`<div class="divider"></div>`);

        this.ele.appendChild(divider);
        return this;
    }

    getOption(id) {
        // Find the option in the top layer
        let option = this.ele.querySelector(`.option[data-opt-id=${id}]`);

        if (option) return option;

        // Find the option within the subnet tree
        for (let menu of this.subnet) {
            option = menu.getOption(id);

            if (option) return option;
        }

        return null;
    }

    set x(scalar) {
        this.ele.style.left = `${scalar}px`;
    }
    get x() {
        return this.ele.getBoundingClientRect().x;
    }

    set y(scalar) {
        this.ele.style.top = `${scalar}px`;
    }
    get y() {
        return this.ele.getBoundingClientRect().y;
    }
}

function flattenSubnet(menu) {
    let list = new Set();
    list.add(menu);

    for (let submenu of menu.subnet) {
        for (let entry of flattenSubnet(submenu)) {
            list.add(entry);
        }
    }

    return list;
}
