// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      27.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('core/utility/logger.js');

/**
 * @class
 *
 * Object for dispatching all incoming events.
 *
 * @extends M.Object
 */
M.EventDispatcher = M.Object.extend(
/** @scope M.EventDispatcher.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.EventDispatcher',

    /**
     * Saves the latest on click event to make sure that there are no multiple events
     * fired for one click.
     *
     * @type {Object}
     */
    lastEvent: {},

    /**
     * This method is used to register events and link them to a corresponding action.
     * 
     * @param {String, Object} eventSource The view's id or a DOM object.
     * @param {Object} events The events to be registered for the given view or DOM object.
     */
    registerEvents: function(eventSource, events, recommendedEvents, sourceType) {
        if(!events || typeof(events) !== 'object') {
            M.Logger.log('No events passed for \'' + eventSource + '\'!', M.WARN);
            return;
        }

        eventSource = this.getEventSource(eventSource);
        if(!this.checkEventSource(eventSource)) {
            return;
        }

        _.each(events, function(handler, type) {
            M.EventDispatcher.registerEvent(type, eventSource, handler, recommendedEvents, sourceType, YES);
        });
    },

    /**
     * This method is used to register a certain event for a certain view or DOM object
     * and link them to a corresponding action.
     *
     * @param {String} type The type of the event.
     * @param {String, Object} eventSource The view's id, the view object or a DOM object.
     * @param {Object} handler The handler for the event.
     * @param {Object} recommendedEvents The recommended events for this event source.
     * @param {Object} sourceType The type of the event source.
     * @param {Boolean} isInternalCall The flag to determine whether this is an internal call or not.
     */
    registerEvent: function(type, eventSource, handler, recommendedEvents, sourceType, isInternalCall) {
        if(!isInternalCall) {
            if(!handler || typeof(handler) !== 'object') {
                M.Logger.log('No event passed!', M.WARN);
                return;
            }

            eventSource = this.getEventSource(eventSource);
            if(!this.checkEventSource(eventSource)) {
                return;
            }
        }

        if(!(recommendedEvents && _.indexOf(recommendedEvents, type) > -1)) {
            if(sourceType && typeof(sourceType) === 'string') {
                M.Logger.log('Event type \'' + type + '\' not recommended for ' + sourceType + '!', M.WARN);
            } else {
                M.Logger.log('Event type \'' + type + '\' not recommended!', M.WARN);
            }
        }

        if(!this.checkHandler(handler, type)) {
            return;
        }

        /* switch enter event to keyup with keycode 13 */
        if(type === 'enter') {
            eventSource.bind('keyup', function(event) {
                if(event.which === 13) {
                    $(this).trigger('enter');
                }
            });
        }

        var that = this;
        eventSource.unbind(type).bind(type, function(event) {
            event.preventDefault();
            event.stopPropagation();

            /* event logger, uncomment for development mode */
            //M.Logger.log('Event \'' + event.type + '\' did happen for id \'' + event.currentTarget.id + '\'', M.INFO);

            if(handler.nextEvent) {
                that.bindToCaller(handler.target, handler.action, [event.currentTarget.id ? event.currentTarget.id : event.currentTarget, event, handler.nextEvent])();
            } else {
                that.bindToCaller(handler.target, handler.action, [event.currentTarget.id ? event.currentTarget.id : event.currentTarget, event])();
            }
        });

    },

    /**
     * This method is used to explicitly call an event handler. We mainly use this for
     * combining internal and external events.
     *
     * @param {Object} handler The handler for the event.
     * @param {Object} event The original DOM event.
     * @param {Boolean} passEvent Determines whether or not to pass the event and its target as the first parameters for the handler call.
     * @param {Array} parameters The (additional) parameters for the handler call.
     */
    callHandler: function(handler, event, passEvent, parameters) {
        if(!this.checkHandler(handler, (event && event.type ? event.type : 'undefined'))) {
            return;
        }

        if(!passEvent) {
            this.bindToCaller(handler.target, handler.action, parameters)();
        } else {
            this.bindToCaller(handler.target, handler.action, [event.currentTarget.id ? event.currentTarget.id : event.currentTarget, event])();
        }
    },

    /**
     * This method is used to check the handler. It tests if target and action are
     * specified correctly.
     *
     * @param {Object} handler The handler for the event.
     * @param {String} type The type of the event.
     * @return {Boolean} Specifies whether or not the check was successful.
     */
    checkHandler: function(handler, type) {
        if(typeof(handler.action) === 'string') {
            if(handler.target) {
                if(handler.target[handler.action] && typeof(handler.target[handler.action]) === 'function') {
                    handler.action = handler.target[handler.action];
                    return YES;
                } else {
                    M.Logger.log('No action \'' + handler.action + '\' found for given target and the event type \'' + type + '\'!', M.WARN);
                    return NO;
                }
            } else {
                M.Logger.log('No valid target passed for action \'' + handler.action + '\' and the event type \'' + type + '\'!', M.WARN);
                return NO;
            }
        } else if(typeof(handler.action) !== 'function') {
            M.Logger.log('No valid action passed for the event type \'' + type + '\'!', M.WARN);
            return NO;
        }

        return YES;
    },

    /**
     * This method is used to get the event source as a DOM object.
     *
     * @param {Object, String} eventSource The event source.
     * @return {Object} The event source as dom object.
     */
    getEventSource: function(eventSource) {
        if(typeof(eventSource) === 'string') {
            eventSource = $('#' + eventSource + ':first');
        } else {
            eventSource = $(eventSource);
        }
        
        return eventSource;
    },

    /**
     * This method is used to check the event source. It tests if it is correctly
     * specified.
     *
     * @param {Object} eventSource The event source.
     * @return {Boolean} Specifies whether or not the check was successful.
     */
    checkEventSource: function(eventSource) {
        if(!eventSource) {
            M.Logger.log('The event source is invalid!', M.WARN);
            return NO;
        }
        
        return YES;
    }

});