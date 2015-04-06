(function($){
    //materialize initializations
    $('#methodSelect').material_select();

    //attach event handlers for buttons
    $('.addHeader').click(function(e){
        var count = $('.headerRow').length;
        $('#headerRowContainer').append(buildItemRow('header', count));
    });

    $('#headerRowContainer').on('click', '.removeRow', function() {
        removeItemRow.call(this);
    });

    $('#paramRowContainer').on('click', '.removeRow', function() {
        removeItemRow.call(this);
    });

    $('.addParam').click(function(e){
        var count = $('.paramRow').length;
        $('#paramRowContainer').append(buildItemRow('param', count));
    });

    $('#btnSubmit').click(function(){
        var endpoint = $('#txtEndpoint').val();
        var method = $('#methodSelect').val();

        performRESTRequest(endpoint, method);
    });

    //helper functions
    function buildItemRow(type, count){
        var rowContainer = $.parseHTML('<div class="row rowItem"></div>');

        var nameContainer = $.parseHTML('<div class="input-field col s5"></div>');
        var nameId = 'txt' + type + 'Name' + count;
        var nameInput = $.parseHTML('<input id="' + nameId + '" type="text">');
        var nameLabel = $.parseHTML('<label for="' + nameId + '">Name</label>');

        $(nameContainer).append(nameInput);
        $(nameContainer).append(nameLabel);

        var valueContainer = $.parseHTML('<div class="input-field col s6"></div>');
        var valueId = 'txt' + type + 'Value' + count;
        var valueInput = $.parseHTML('<input id="' + valueId + '" type="text">');
        var valueLabel = $.parseHTML('<label for="' + valueId + '">Value</label>');

        $(valueContainer).append(valueInput);
        $(valueContainer).append(valueLabel);

        var button = $.parseHTML('<div class="col s1 rowItemButton"><a class="btn-floating red removeRow"><i class="mdi-content-remove"></i></a></div>');

        $(rowContainer).append(nameContainer);
        $(rowContainer).append(valueContainer);
        $(rowContainer).append(button);

        return rowContainer;
    }

    function removeItemRow(){
        $(this).parent().parent().remove();
    }

    function gatherItemRowFields(selector){
        var rows = $(selector);
        var data = {};
        rows.children().each(function(index, row){
            var fields = $(row).find('input[type=text]');
            var name = fields[0].value;
            var val = fields[1].value;

            data[name] = val;
        });

        return data;
    }

    function performRESTRequest(endpoint, method){
        var headerData = gatherItemRowFields('#headerRowContainer');
        var paramData = gatherItemRowFields('#paramRowContainer');

        $.ajax({
            url: endpoint,
            method: method,
            headers: headerData,
            data: paramData
        }).done(function(data, textStatus, jqXHR){
            var statusText = $('#txtStatusCode');
            statusText.removeClass('fail');
            statusText.addClass('success');
            statusText.html(jqXHR.status);

            $('#requestDataOutput').html(JSON.stringify(data, undefined, 2));
        }).fail(function(jqXHR, textStatus, err){
            var statusText = $('#txtStatusCode');
            statusText.removeClass('success');
            statusText.addClass('fail');
            statusText.html(jqXHR.status);

            $('#requestDataOutput').html(JSON.stringify(err, undefined, 2));
        })
    }
})(jQuery);