/**
 * Defines the main contructor function.
 * 
 * @constructor
 * @author Adi Purdila adipurdila@gmail.com
 * @version 1.0
 * @since 1.0
 */
function APTour() {
    // Get the tour items.
    this.tourItems = document.querySelectorAll('[data-aptour]');

    // If there are no tour items, log an error and return.
    if (this.tourItems.length === 0) {
        if (console) {
            console.error('Sorry, we couldn\'t find any valid tour items.');
        }

        return;
    }

    // Handle navigation button clicks.
    document.body.addEventListener('click', this.handleClicks.bind(this));

    // Initialize the tour.
    this.initialize();
}



/**
 * Initializes the tour by creating the stops and showing the first one.
 * 
 * @function
 */
APTour.prototype.initialize = function() {
    var tourWindowContents = "";

    // Define the stops, cursor and offset.
    this.stops = [];
    this.cursor = 0;
    this.offset = 20; // The distance between the window and the parent element.

    // Populate the stops array with all the tour objects.
    for (var i = 0; i < this.tourItems.length; i++) {
        this.stops[i] = JSON.parse(this.tourItems[i].getAttribute('data-aptour'));
    }

    // Create an overlay on the entire page.
    this.overlay = document.createElement('div');
    this.overlay.className = 'aptour-overlay';
    document.body.insertBefore(this.overlay, document.body.childNodes[0]);

    // Create the main tour window and populate its content.
    this.tourWindow = document.createElement('div');
    this.tourWindow.className = 'aptour-window';
    tourWindowContents += '<header></header>';
    tourWindowContents += '<div class="aptour-window-desc"></div>';
    tourWindowContents += '<footer>';
    tourWindowContents += '<button data-aptour-nav="prev">Prev</button>';
    tourWindowContents += '<button data-aptour-nav="next">Next</button>';
    tourWindowContents += '<button data-aptour-nav="close">Close tour</button>';
    tourWindowContents += '</footer>';
    this.tourWindow.innerHTML = tourWindowContents;
    document.body.insertBefore(this.tourWindow, document.body.childNodes[0]);

    // Show the first step.
    this.moveTo(this.cursor);
};



/**
 * Shows a specific stop.
 * 
 * @function
 * @param {Number} index - The position of the stop we need to show.
 */
APTour.prototype.moveTo = function(index) {
    var parent = this.tourItems[index],
    parentSpecs = parent.getBoundingClientRect(),
    bodySpecs = document.body.getBoundingClientRect(),
    position = this.stops[index].position,
    left, top, scrollPosition;

    // If the CSS position isn't set, set to relative.
    if (parent.style.position === '') {
        parent.style.position = 'relative';
    }

    // Add the active class.
    parent.classList.add('aptour-active');

    // Set the tour window contents.
    this.tourWindow.querySelector('header').innerHTML = this.stops[index].title;
    this.tourWindow.querySelector('.aptour-window-desc').innerHTML = this.stops[index].desc;

    // Set the tour window coordinates.
    switch (position) {
        case 'top':
            // Center H.
            left = parentSpecs.left + ((parent.offsetWidth - this.tourWindow.offsetWidth) / 2);            
            top = parentSpecs.top - this.tourWindow.offsetHeight - this.offset - bodySpecs.top;
            scrollPosition = parentSpecs.top - bodySpecs.top - this.tourWindow.offsetHeight - this.offset;
            break;
        
        case 'right':
            left = parentSpecs.right + this.offset;
            // Center V.
            top = (parentSpecs.top + parentSpecs.bottom) / 2 - this.tourWindow.offsetHeight / 2 - bodySpecs.top;
            scrollPosition = parentSpecs.top - bodySpecs.top;
            break;
        
        case 'bottom':
            // Center H.
            left = parentSpecs.left + ((parent.offsetWidth - this.tourWindow.offsetWidth) / 2);
            top = parentSpecs.bottom + this.offset - bodySpecs.top;
            scrollPosition = parentSpecs.top - bodySpecs.top;
            break;
        
        case 'left':
            left = parentSpecs.left - this.offset - this.tourWindow.offsetWidth;
            // Center V.
            top = (parentSpecs.top + parentSpecs.bottom) / 2 - this.tourWindow.offsetHeight / 2 - bodySpecs.top;
            scrollPosition = parentSpecs.top - bodySpecs.top;
            break;
    }

    window.scrollTo(0, scrollPosition);
    this.tourWindow.style.left = left + 'px';
    this.tourWindow.style.top = top + 'px';
};



/**
 * Handles click events.
 * 
 * @function
 * @param {Object} event - The click event.
 */
APTour.prototype.handleClicks = function(event) {
    var targetAttr = event.target.getAttribute('data-aptour-nav');

    // Only listen for button clicks.
    if (targetAttr) {
        event.preventDefault();

        switch (targetAttr) {
            case 'prev':
                if (this.cursor > 0) {
                    this.tourItems[this.cursor].classList.remove('aptour-active');
                    this.moveTo(--this.cursor);
                }
                break;
            case 'next':
                if (this.cursor < this.stops.length - 1) {
                    this.tourItems[this.cursor].classList.remove('aptour-active');
                    this.moveTo(++this.cursor);
                }                
                break;
            case 'close':
                // Delete the window.
                document.body.removeChild(this.overlay);
                document.body.removeChild(this.tourWindow);
                break;
        }
    }
};