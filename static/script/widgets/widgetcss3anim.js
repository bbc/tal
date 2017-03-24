define('antie/widgets/widgetcss3anim', [
    'antie/widgets/widget'
], function (Widget) {
    function redraw(widget) {
        var output = widget.outputElement;
        var parent = output.parentElement;
        var outputIndex = Array.prototype.indexOf.call(parent.children, output);
        if (parent.children[outputIndex + 1]) {
            var nextElement = parent.children[outputIndex + 1];
            parent.removeChild(output);
            parent.insertBefore(output, nextElement);
        } else {
            parent.removeChild(output);
            parent.appendChild(output);
        }
    }

    Widget.prototype.addClass = function (className) {
        if (!this._classNames[className]) {
            this._classNames[className] = true;
            if (this.outputElement) {
                var device = this.getCurrentApplication().getDevice();
                device.setElementClasses(this.outputElement, this.getClasses());
            }
        }
        redraw(this);
    };

    Widget.prototype.removeClass = function (className) {
        if (this._classNames[className]) {
            delete(this._classNames[className]);
            if (this.outputElement) {
                var device = this.getCurrentApplication().getDevice();
                device.setElementClasses(this.outputElement, this.getClasses());
            }
        }
        redraw(this);
    };
});
