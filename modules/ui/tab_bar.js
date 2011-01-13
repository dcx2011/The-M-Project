// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      16.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * The is the prototype of any tab bar view. A tab bar view is a special variant of a toolbar
 * at the top or bottom of a page, that consists of up to five horizontally aligned tabs. An
 * M.TabBarView can be used the top navigation level for an application since it is always
 * visible an indicates the currently selected tab.
 *
 */
M.TabBarView = M.View.extend(
/** @scope M.TabBarView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.TabBarView',
    
     /**
     * Defines the position of the TabBar. Possible values are:
     *
     * - M.BOTTOM => is a footer tab bar
     * - M.TOP => is a header tab bar
     * - null / not set ==> a tab bar outside header / footer
     *
     * @type String
     */
    anchorLocation: null,

    /**
     * This property defines the tab bar's name. This is used internally to identify
     * the tab bar inside the DOM.
     *
     * @type String
     */
    name: 'tab_bar',

    /**
     * This property holds a reference to the currently active tab.
     *
     * @type M.TabBarItemView
     */
    activeTab: null,

    /**
     * Renders a tab bar as an unordered list.
     *
     * @private
     * @returns {String} The tab bar view's html representation.
     */
    render: function() {
        if(!this.html) {
            this.html = '';

            if(this.anchorLocation) {
                this.html += '<div id="' + this.id + '" data-id="' + this.name + '" data-role="' + this.anchorLocation + '" data-position="fixed"><div data-role="navbar"><ul>';
            } else {
                this.html += '<div data-role="navbar" id="' + this.id + '" data-id="' + this.name + '"><ul>';
            }

            this.renderChildViews();

            this.html += '</ul></div>';

            if(this.anchorLocation) {
                this.html += '</div>';
            }
        }
        return this.html;
    },

    /**
     * Triggers render() on all children of type M.TabBarItemView.
     *
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = $.trim(this.childViews).split(' ');

            /* pre-process the child views to define which tab is selected */
            var hasActiveTab = NO;
            for(var i in childViews) {
                var view = this[childViews[i]];
                if(view.type === 'M.TabBarItemView' && view.isActive) {
                    if(!hasActiveTab) {
                        hasActiveTab = YES;
                        this.activeTab = view;
                    } else {
                        view.isActive = NO;
                    }
                }
            }

            var numTabBarViews = 0;
            for(var i in childViews) {
                var view = this[childViews[i]];
                if(view.type === 'M.TabBarItemView') {
                    numTabBarViews = numTabBarViews + 1;

                    /* set first tab to active tab if nothing else specified */
                    if(numTabBarViews === 1 && !hasActiveTab) {
                        view.isActive = YES;
                        this.activeTab = view;
                    }

                    view.parentView = this;
                    this.html += view.render();
                } else {
                    M.Logger.log('Invalid child views specified for TabBarView. Only TabBarItemViews accepted.', M.WARN);
                }
            }
        } else {
            M.Logger.log('No TabBarItemViews specified.', M.WARN);
            return;
        }
    },

    /**
     * This method visually activates a tab bar item based on a given page.
     *
     * @param {M.TabBarItemView} tab The tab to set active.
     */
    setActiveTab: function(tab) {
        var timeStart = M.Date.now();

        console.log(tab.id);

        /* deactivate current active tav */
        this.activeTab.isActive = NO;

        var that = this;

        $('[data-id="' + this.name + '"]').each(function() {
            $(this).find('#' + that.activeTab.id).removeClass('ui-btn-active');
        });

        /* activate new tab */
        tab.isActive = YES;
        $('[data-id="' + this.name + '"]').each(function() {
            $(this).find('#' + tab.id).addClass('ui-btn-active');
        });

        /* store active tab in tab bar */
        this.activeTab = tab;

        var timeEnd = M.Date.now();
        var totalTime = timeStart.timeBetween(timeEnd);
        console.log('### Time for: setActiveTab call: ' + totalTime);
    }

});