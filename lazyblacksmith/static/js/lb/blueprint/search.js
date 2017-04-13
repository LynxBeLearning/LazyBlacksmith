var searchBlueprint = (function ($, lb, utils) {
    "use strict";

    var blueprintBodyResult = '#searchBlueprintResult tbody';
    var noResultMessage = '<tr><td colspan="2">No results.</td></tr>';
    var resultBtn = '<a href="@@LINK@@" class="btn btn-default btn-xs pull-right">@@NAME@@</a> ';

    var showCorporationBlueprints = false;

    $.extend(lb.urls, {
        searchUrl: false,
        inventionUrl: '',
        manufacturingUrl: '',
        researchUrl: ''
    });

    var blueprintOldValue = "";

    /**
     * Toggle corporation blueprints
     */
    var _toggleCorporationBlueprintsOnChange = function() {
        var checked = this.checked;
        if(this.checked) {
            $('.blueprint-corporation').show();
            $('.blueprint-character').hide();
            $("#toggleCorporationBlueprints label").removeClass('btn-default').addClass('btn-info');
        } else {
            $('.blueprint-corporation').hide();
            $('.blueprint-character').show();
            $("#toggleCorporationBlueprints label").removeClass('btn-info').addClass('btn-default');
        }
        showCorporationBlueprints = this.checked;
        _searchOwnedBlueprint($('#ownedBlueprintSearch').val().toLowerCase());
    };

    /**
     * Search blueprint function
     * @param string the name we want to search
     * @private
     */
    var _searchBlueprint = function(name) {
        if(name == blueprintOldValue) {
            return false;
        }
        var url = lb.urls.searchUrl;
        if(!url) {
            alert('Search Blueprint URL has not been set.');
            return false;
        }

        // remove all problematic chars
        var nameEscaped = name.replace(/\//g, "")
                              .replace(/\\/g, "")
                              .replace(/`/g, "");

        if(nameEscaped.length < 3) {
            $(blueprintBodyResult).html(noResultMessage);
            return false;
        }

        url = url.replace(/0000/, nameEscaped);

        // ajax call to get the blueprints
        utils.ajaxGetCallJson(url, function(jsonData) {
            var htmlResult = "";
            var data = jsonData.result;

            // for each items in data
            for(var item in data) {
                var inventionLink = lb.urls.inventionUrl.replace(/999999999/, data[item].id);
                var manufacturingLink = lb.urls.manufacturingUrl.replace(/999999999/, data[item].id);
                var researchLink = lb.urls.researchUrl.replace(/999999999/, data[item].id);

                var invention = (data[item].invention) ? resultBtn.replace(/@@LINK@@/, inventionLink).replace(/@@NAME@@/, 'Invention') : '';
                var research = resultBtn.replace(/@@LINK@@/, researchLink).replace(/@@NAME@@/, 'Research/Copy');
                var manufacturing = resultBtn.replace(/@@LINK@@/, manufacturingLink).replace(/@@NAME@@/, 'Manufacture');

                htmlResult += "<tr><td>" + data[item].name + '</td><td>' + manufacturing + research + invention + '</td></tr>';
            }

            // display result
            if(htmlResult == "") {
                $(blueprintBodyResult).html(noResultMessage);
            } else {
                $(blueprintBodyResult).html(htmlResult);
            }
        }, function() {
            $(blueprintBodyResult).html('<tr><td colspan="2">Error while trying to get results.</td></tr>');
        });
    };

    /**
     * Seaerch through the owned blueprint list.
     */
    var _searchOwnedBlueprint = function(name) {
        var classToFilter = (showCorporationBlueprints) ? '.blueprint-corporation' : '.blueprint-character';
        $(classToFilter).show();
        $(classToFilter).filter(function() {
            var bpName = $(this).find('td.name').html().toLowerCase();
            return bpName.indexOf(name) == -1;
        }).hide();
    };

    /**
     * Runner function
     */
    var run = function() {
        $('#blueprint').typeWatch({
            callback: function (value) {
                _searchBlueprint(value);
            },
            wait: 250,
            highlight: true,
            captureLength: 3
        }).on('keydown',
            function() {
                blueprintOldValue = $(this).val();
            }
        );

        $('#ownedBlueprintSearch').typeWatch({
            callback: function (value) {
                _searchOwnedBlueprint(value.toLowerCase());
            },
            wait: 250,
            highlight: true,
            captureLength: 0
        }).on('keydown',
            function() {
                blueprintOldValue = $(this).val();
            }
        );
        $("#toggleCorporationBlueprints input[type='checkbox']").on('change', _toggleCorporationBlueprintsOnChange);
    };


    return {
        run: run,
    }

}) (jQuery, lb, utils);

lb.registerModule('searchBlueprint', searchBlueprint);
