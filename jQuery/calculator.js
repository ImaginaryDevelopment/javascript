$('div.content:first').append($('<div class="age">').text('Loaded.').delay('400').fadeOut('slow', function () {
    $(this).text(new Date()).fadeIn('fast');
}));
$('#newoperand').on('click', function () {
    $('<input type="text" class="userinput">').insertBefore(this);
});
var calcArray = function (op, v) {
    var result = +v[0];
    for (var i = 1; i < v.length; i++) {
        result = op(result, +v[i]);
    }
    return result;
};
var divide = function (x, y) {
    return x / y;
};
var multiply = function (x, y) {
    return x * y;
}
var add = function (x, y) {
    return x + y;
};
var subtract = function (x, y) {
    return x - y;
};

var mod = function (x, y) {
    return x % y;
};
var operations = [{
    key: '+',
    id: 'plus',
    f: add
}, {
    key: '-',
    id: 'subtract',
    f: subtract
}, {
    key: '*',
    id: 'multiply',
    f: multiply
}, {
    key: '/',
    id: 'divide',
    f: divide
}, {
    key: '%',
    id: 'mod',
    f: mod
}];
$c = $('#container');
$.each(operations, function (i, e) {
    //foreach( var e in operations){

    var input = document.createElement('input');
    $(input).attr('type', 'button').val(e.key).attr('id', e.id).addClass('operation').attr('title', e.id);

    $c.append(input);

    $('input#' + e.id).on('click', function () {
        showcalc(e.f);
    });
});

var values = function () {
    var result = [];
    $('input[type=text].userinput').each(function (i, e) {
        var val = $(this).val();
        if (val !== undefined) {
            result.push(val);
        }
    });
    return result;
};

var showcalc = function (operation) {
    var v = values();
    show(calcArray(operation, v));
};

var show = function (value) {
    $('.result').fadeOut('slow', function () {
        $(this).clearQueue().text(value).hide().fadeIn('slow');
    })

};

$('body').on('keypress', function (e) {
    $.each(operations, function (i, op) {
        if (e.which === op.key.charCodeAt(0)) {
            e.preventDefault();
            showcalc(op.f);
            return;
        }
    });

});
var cssEvents=[{event:'mouseout',s:'input[type=text]',css: 'background-color',v:''},
               {event:'mouseover',s:'input[type=text]',css:'background-color',v:'yellow'},
               {event:'focusin',s:'input[type=text]',css:'background-color',v:'grey'},
{event:'focusout',s:'input[type=text]',css:'background-color',v:''},
              ];
$.each(cssEvents,function(i,e){
    $(document).on(e.event,e.s,function(){
        $(this).css(e.css,e.v);
    });
});