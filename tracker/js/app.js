
$('document').ready( function () {

    // Used by delete 
    // QUESTION: better to declare this at top of scope? or right above the function that uses it
    var animationInProgress = false;
    var animationSpeed = 700;
    //          #######################
    //----------####  BEGIN SETUP  ####----(Begin Section)---------------------------------------------------
    //          #######################

    // Store all tasks objects here
    var taskList = [];

    // Get a clean copy of the <tr> elements for adding rows later 
    var taskRow = $('.taskRow').clone();
    var favoriteRow = $('.favoriteRow').clone();
    var perDayRow = $('.perDayRow').clone();
    var perMonthRow = $('.perMonthRow').clone();

    // Remove all rows from bottom tables until some tags have been created
    $('.favoriteRow').remove();
    $('.perDayRow').remove();
    $('.perMonthRow').remove();
    
    // Set default Start/Stop times to now
    $('.startInput').val( new Date().toString().slice(4,-18) );
    $('.stopInput').val( new Date().toString().slice(4,-18) );


    //          #######################
    //----------#####  END SETUP  #####----(End Section)---------------------------------------------------
    //          #######################

    //          #######################
    //----------#### BEGIN BUTTONS ####----(Begin Section)---------------------------------------------------
    //          #######################

    // Save button
    $('body').on('click', '.btn-save', function (e) {

        // If any animation is still in progress, do nothing
        if (animationInProgress) { return; }
        
        // Get the index relative to its .taskRow siblings
        var index = $(e.target).parents('.taskRow').index();

        // Validate Start/Stop fields
        function isValidInput (inputClass, invalidMessage) {
            if (  ! Date.parse( $(e.target).parents('.taskRow').children('td').children(inputClass).val() )  ) {
                alert(invalidMessage); // Invalid 
                return false;
                // TODO: Reset input value to last valid input
            }
            return true; // Validbb
        }

        // If input is invalid, return handler function immediately, without saving.
        if ( ! isValidInput('.startInput', 'Invalid Start date') ||
             ! isValidInput('.startInput', 'Invalid Stop date')     ) {
            return;
        }

        // These will be stored in the array taskList
        var savedObject = {};

        var $inputParents = $(e.target).parents('.taskRow').children();

        // Get input values, and store Start/Stop as Dates, Description as string, and Tags as array of strings
        savedObject.tags =    _.uniq( $inputParents.children('.tagInput').val().replace(' ', '').split(',') ); // Remove white space, and repeated tags
        savedObject.start = new Date( $inputParents.children('.startInput').val() );
        savedObject.stop =  new Date( $inputParents.children('.stopInput').val() );
        savedObject.description =     $inputParents.children('.descriptionInput').val();
        savedObject.day =   savedObject.start.getDate();
        savedObject.month = savedObject.start.getMonth() + 1;
        savedObject.duration = getDurationMinutes(savedObject.start, savedObject.stop);

        // Insert a non-referenced clone of savedObject into taskList array
        taskList[ index ] = _.clone( savedObject );

        // If saving the last row, add a new empty row
        if ( $(e.target).parents('.taskRow').is(':last-child') ) {
            $(e.target).parents('tbody').append( taskRow.clone() );
            // Set default Start/Stop times to now
            $('.startInput').val( new Date().toString().slice(4,-18) );
            $('.stopInput').val( new Date().toString().slice(4,-18) );
        }

        // Replace <input> fields with <span> elements containing the user's input values
        $inputParents.children('.tagInput').after('<span class="tagSpan">' + savedObject.tags.join(', ') + '</span>').remove();
        $inputParents.children('.durationSpan').html( getDurationMinutes( savedObject.start, savedObject.stop ) + ' minutes');
        $inputParents.children('.startInput').after('<span class="startSpan">' + savedObject.start.toString().slice(4,-18) + '</span>').remove();
        $inputParents.children('.stopInput').after('<span class="stopSpan">' + savedObject.stop.toString().slice(4,-18) + '</span>').remove();
        $inputParents.children('.descriptionInput').after('<span class="descriptionSpan">' + savedObject.description + '</span>').remove();

        // Hide Save button, and reveal Edit, Delete
        $(e.target).parents('.buttonTd').children('.btn-save').addClass('hidden');
        $(e.target).parents('.buttonTd').children('.btn-edit').removeClass('hidden');
        $(e.target).parents('.buttonTd').children('.btn-delete').removeClass('hidden');

        // Get new tag durations and update tally tables
        var currentDurations = getTagDurations();
        updateFavoriteActivitiesTable( currentDurations );
        updatePerDayTable( taskList );
        updateThisMonthTable( taskList );

    });

    // Edit button
    $('body').on('click', '.btn-edit', function (e) {

        // If any animation is still in progress, do nothing
        if (animationInProgress) { return; }

        var $inputParents = $(e.target).parents('.taskRow').children();

        // Hide Edit button and reveal Save button
        $(e.target).parents('.buttonTd').children('.btn-edit').addClass('hidden');
        $(e.target).parents('.buttonTd').children('.btn-save').removeClass('hidden');

        // Get the index relative to its .taskRow siblings
        var index = $(e.target).parents('.taskRow').index();

        // Replace <span> elements with <input> fields
        $inputParents.children('.tagSpan').after('<input class="tagInput" type="text" name="tags">').remove();
        $inputParents.children('.startSpan').after('<input class="startInput wid-110" type="text" name="start">').remove();
        $inputParents.children('.stopSpan').after('<input class="stopInput wid-110" type="text" name="stop">').remove();
        $inputParents.children('.descriptionSpan').after('<input class="descriptionInput wid-180" type="text" name="description">').remove();

        // use the index to pull the matching record from taskList data model, and enter into <input> fields
        $inputParents.children('.tagInput').val( taskList[index].tags );
        $inputParents.children('.durationSpan').html( getDurationMinutes(taskList[index].start, taskList[index].stop ) + ' minutes' );
        $inputParents.children('.startInput').val( taskList[index].start.toString().slice(4,-18) );
        $inputParents.children('.stopInput').val( taskList[index].stop.toString().slice(4,-18) );
        $inputParents.children('.descriptionInput').val( taskList[index].description );
        

    });

    // Delete button
    $('body').on('click', '.btn-delete', function (e) {

        // If any animation is still in progress, do nothing
        if (animationInProgress) { return; }

        // Prevent a delete event from occuring until delete is complete (which would cause index problems and decouple view/model)
        // QUESTION: This is the first of problems that I vaguely expected by not coupling the
        //           view <tr> element to the data in taskList []. Should I have found some way 
        //           to include a unique identifier, connecting the HTML to the data? 
        animationInProgress = true;

        // Get the index relative to its .taskRow siblings
        var index = $(e.target).parents('.taskRow').index();

        // Remove data
        taskList.splice(index, 1);

        // Fade out row
        $(e.target).parents('.taskRow').fadeOut(animationSpeed, 'linear', function () { 
            // Delete in view
            $(e.target).parents('.taskRow').remove(); 
            // Delete is complete, allow the next delete event
            animationInProgress = false;
        });

        // Get new tag durations and update tally tables
        var currentDurations = getTagDurations();
        updateFavoriteActivitiesTable( currentDurations );
        updatePerDayTable( taskList );
        updateThisMonthTable( taskList );


    });

    //          #######################
    //----------####  END BUTTONS  ####----(End Section)-----------------------------------------------------
    //          #######################

    //          #######################
    //----------# BEGIN FOOTER TABLES #----(Begin Section)---------------------------------------------------
    //          #######################
    //
    //                  - # - # - # - # - #
    //                  #   BEGIN TAGS    -     (Begin Subsection)
    //                  - # - # - # - # - #

    function getTagDurations () {

        var durations = {};

        for (var i = 0; i < taskList.length; i++) {
            var currentDuration = getDurationMinutes( taskList[i].start, taskList[i].stop );
            for (var j = 0; j < taskList[i].tags.length; j++) {
                var currentTagName = taskList[i].tags[j];
                // Set key:val of durations object to tag:duration, and increment duration value on subsequent iterations
                durations[currentTagName] = durations[currentTagName] ? (durations[currentTagName] + currentDuration) : currentDuration ;
            }
        }

        // Convert to an array of {name: tagName, duration: 30} objects, for easier sorting
        var returnArray = [];
        for (var prop in durations) {
            returnArray.push( { 'name': prop, 'duration': durations[prop] } );
        }

        // Sort by duration, low to high
        returnArray = _(returnArray).sortBy('duration');

        return returnArray; //
    }

    // Take two native Date objects and return the duration in minutes
    function getDurationMinutes (start, stop) {
        return ( (stop / 1000) / 60 ) - ( (start / 1000) / 60 );
    }    

    // Update the Favorite Activities table
    function updateFavoriteActivitiesTable (tagDurations) {
        // Fade out current contents and then remove
        $('#favoriteActivitiesTable').children('tbody').children('.favoriteRow').fadeOut( animationSpeed / 2, 'linear', function () {
            this.remove();
        });
        // QUESTION: Why can't this work in the callback function above!?!? Great confusion.
        setTimeout( function () {
            for (var i = tagDurations.length - 1; i >= 0; i--) {
                // Insert a row clone
                $('#favoriteActivitiesTable').children('tbody').append( favoriteRow.clone() );
                // Set display to none for upcoming fadeIn
                $('.favoriteRow:last').css('display', 'none');
                // Insert values
                $('.favoriteRow:last').children('td:eq(0)').html('<span>' + tagDurations[i].name + '</span>');
                $('.favoriteRow:last').children('td:eq(1)').html('<span>' + tagDurations[i].duration + '</span>');
                // Fade in
                $('.favoriteRow:last').fadeIn( animationSpeed / 2,'linear');
            }
        }, animationSpeed / 2 );
    }

    //                  - # - # - # - # - #
    //                  #    END TAGS     -     (End Subsection)
    //                  - # - # - # - # - #

    // Get data for and update the "Total Time Per Day" table
    function updatePerDayTable (taskList) {
        // Fade out current contents and then remove
        $('#perDayTable').children('tbody').children('.perDayRow').fadeOut( animationSpeed / 2, 'linear', function () {
            this.remove();
        });

        // Group by day of month
        var groupedByDay = _(taskList).groupBy('day');

        // Sum duration of all activities on each day
        var summed = []; 
        for (var prop in groupedByDay) {
            var sum = 0; // initialize or reset
            var month = groupedByDay[prop][0].month;
            for (var i = 0; i < groupedByDay[prop].length; i++) {
                sum += groupedByDay[prop][i].duration;
            }
            summed.push( { 'month': month, 'date': prop, 'summedDuration': sum } );
        }

        // Update the Total Time Per Day table
        setTimeout( function () {
            for (var i = 0; i < summed.length; i++) {
                 // Insert a row clone
                $('#perDayTable').children('tbody').append( perDayRow.clone() );
                // Set display to none for upcoming fadeIn
                $('.perDayRow:last').css('display', 'none');
                // Insert values
                $('.perDayRow:last').children('td:eq(0)').html('<span>' + summed[i].month + '/' + summed[i].date + '</span>');
                $('.perDayRow:last').children('td:eq(1)').html('<span>' + summed[i].summedDuration + ' minutes' + '</span>');
                // Fade in
                $('.perDayRow:last').fadeIn( animationSpeed / 2,'linear');
            }
        }, animationSpeed / 2 );

    }

    // Get data for and update the "Total Time This Month" table
    function updateThisMonthTable (taskList) {

        // Get current month
        var currentMonth = new Date().getMonth() + 1;

        // Filter only tasks in current month, and reduce to get summed duration
        var summedMonthDuration = _(taskList).chain()
                                     .filter( function (obj) {return obj.month === currentMonth;} )
                                     .reduce( function(memo, val) {return memo + val.duration;} , 0 )
                                     .value();

        // Remove old row
        $('#perMonthTable').children('tbody').children('.perMonthRow').remove();

        // Don't display anything if 0 duration
        if ( summedMonthDuration !== 0 ) {
            // Add new row with updated Total Time This Month
            $('#perMonthTable').children('tbody').append( perMonthRow.clone() );
            $('.perMonthRow:last').children('td').html('<span>' + summedMonthDuration + ' minutes' +'</span>');
        }
    }
        
    //          #######################
    //----------## END FOOTER TABLES ##----(End Section)-----------------------------------------------------
    //          #######################


});



