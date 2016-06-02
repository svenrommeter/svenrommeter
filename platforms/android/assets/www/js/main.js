startCircle1 = function() {
    circle = new ProgressBar.Circle('#progress', {
        color: '#fff',
        strokeWidth: 6,
        trailWidth: 3,
        easing: 'linear',
        duration: 1,
        text: {
            autoStyleContainer: false
        },
        from: {color: '#3f3', width: 6},
        to: {color: '#3f3', width: 6},
        // Set default step function for all animate calls
        step: function (state, circlex) {
            circlex.path.setAttribute('stroke', state.color);
            circlex.path.setAttribute('stroke-width', state.width);
            var value = Math.round(circlex.value() * 360);
            circlex.setText(value + "&deg");
        }
    });
    circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    circle.text.style.fontSize = '6rem';

};

startCircle2 = function() {
    circle = new ProgressBar.Circle('#progress', {
        color: '#fff',
        strokeWidth: 6,
        trailWidth: 3,
        easing: 'linear',
        duration: 1,
        text: {
            autoStyleContainer: false
        },
        from: {color: '#3f3', width: 6},
        to: {color: '#3f3', width: 6},
        // Set default step function for all animate calls
        step: function (state, circlex) {
            circlex.path.setAttribute('stroke', state.color);
            circlex.path.setAttribute('stroke-width', state.width);
            var value = Math.round(circlex.value() * 360);
            circlex.setText(value + "&deg");
        }
    });
    circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    circle.text.style.fontSize = '6rem';

};

startCircle3 = function() {
    circle = new ProgressBar.Circle('#progress', {
        color: '#fff',
        strokeWidth: 6,
        trailWidth: 3,
        easing: 'linear',
        duration: 1,
        text: {
            autoStyleContainer: false
        },
        from: {color: '#3f3', width: 6},
        to: {color: '#3f3', width: 6},
        // Set default step function for all animate calls
        step: function (state, circlex) {
            circlex.path.setAttribute('stroke', state.color);
            circlex.path.setAttribute('stroke-width', state.width);
            var value = Math.round(circlex.value() * 360);
            circlex.setText(value + "&deg");
        }
    });
    circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    circle.text.style.fontSize = '6rem';

};
