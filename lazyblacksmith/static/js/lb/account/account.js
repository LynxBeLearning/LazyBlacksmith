var accountDashboard = (function($, lb, utils, eveUtils, eveData) {
    "use strict";
    var regions = {};
    
    $.extend(lb.urls, {
        updatePreferenceUrl: false,
    });

    var inventionSettings = {
        facility: false,
        inventionRig: false,
        copyRig: false,
        security: false,
        system: false,
        priceRegion: false,
        priceType: false,
    };
    
    var researchSettings = {
        facility: false,
        meRig: false,
        teRig: false,
        copyRig: false,
        security: false,
        system: false,
    };
    
    var productionSettings = {
        facility: false,
        meRig: false,
        teRig: false,
        security: false,
        system: false,
        componentFacility: false,
        componentMeRig: false,
        componentTeRig: false,
        componentSecurity: false,
        componentSystem: false,
        priceMineralRegion: false,
        priceMineralType: false,
        pricePiRegion: false,
        pricePiType: false,
        priceMoongooRegion: false,
        priceMoongooType: false,
        priceOtherRegion: false,
        priceOtherType: false,
    };

    var _initProdModal = function() {
        $('#modalConfigProd').on('show.bs.modal', function(event) {
            $('#modal-system-main').val(productionSettings.system);
            $('#modal-system-comp').val(productionSettings.componentSystem);
            
            $('#modal-facility-main').val(productionSettings.facility)
            $('#modal-facility-comp').val(productionSettings.componentFacility);
            
            $('#modal-structure-me-rig-main input[value='+productionSettings.meRig+']').parent().button("toggle");
            $('#modal-structure-te-rig-main input[value='+productionSettings.teRig+']').parent().button("toggle");
            $('#modal-structure-me-rig-comp input[value='+productionSettings.componentMeRig+']').parent().button("toggle");
            $('#modal-structure-te-rig-comp input[value='+productionSettings.componentTeRig+']').parent().button("toggle");
            
            $('#modal-structure-security-main input[value='+productionSettings.security+']').parent().button("toggle");
            $('#modal-structure-security-comp input[value='+productionSettings.componentSecurity+']').parent().button("toggle");
            
            
            $('.modal-region-minerals-type input[value='+productionSettings.priceMineralType+']').parent().button("toggle");
            $('.modal-region-pi-type input[value='+productionSettings.pricePiType+']').parent().button("toggle");
            $('.modal-region-moongoo-type input[value='+productionSettings.priceMoongooType+']').parent().button("toggle");
            $('.modal-region-others-type input[value='+productionSettings.priceOtherType+']').parent().button("toggle");
            
            $("select[name='modal-region-minerals']").val(productionSettings.priceMineralRegion);
            $("select[name='modal-region-pi']").val(productionSettings.pricePiRegion);
            $("select[name='modal-region-moongoo']").val(productionSettings.priceMoongooRegion);
            $("select[name='modal-region-others']").val(productionSettings.priceOtherRegion); 
            
            if(eveData.facilities[productionSettings.facility].structure) {
                $('.modal-structure-configs-main').show();
            } else {
                $('.modal-structure-configs-main').hide();
            }
            if(eveData.facilities[productionSettings.componentFacility].structure) {
                $('.modal-structure-configs-comp').show();
            } else {
                $('.modal-structure-configs-comp').hide();
            }
        });
        _initProdModalEvents();
    };
    
    var _initProdModalEvents = function() {
        $('#modal-facility-main').on('change', function() {
            if(eveData.facilities[parseInt($(this).val())].structure) {
                $('.modal-structure-configs-main').show();
            } else {
                $('.modal-structure-configs-main').hide();
            }
        });
        $('#modal-facility-comp').on('change', function() {
            if(eveData.facilities[parseInt($(this).val())].structure) {
                $('.modal-structure-configs-comp').show();
            } else {
                $('.modal-structure-configs-comp').hide();
            }
        });
    };
    
    var _onModalProdSettingsApply = function(event) {
        var productionSettingsTmp = {
            facility: parseInt($('#modal-facility-main').val()),
            meRig: parseInt($('#modal-structure-me-rig-main input:checked').val()),
            teRig: parseInt($('#modal-structure-te-rig-main input:checked').val()),
            security: $('#modal-structure-security-main input:checked').val(),
            system: $('#modal-system-main').val(),
            componentFacility: parseInt($('#modal-facility-comp').val()),
            componentMeRig: parseInt($('#modal-structure-me-rig-comp input:checked').val()),
            componentTeRig: parseInt($('#modal-structure-te-rig-comp input:checked').val()),
            componentSecurity: $('#modal-structure-security-comp input:checked').val(),
            componentSystem: $('#modal-system-comp').val(),
            priceMineralRegion: parseInt($("select[name='modal-region-minerals']").val()),
            priceMineralType: $('.modal-region-minerals-type input:checked').val(),
            pricePiRegion: parseInt($("select[name='modal-region-pi']").val()),
            pricePiType: $('.modal-region-pi-type input:checked').val(),
            priceMoongooRegion: parseInt($("select[name='modal-region-moongoo']").val()),
            priceMoongooType: $('.modal-region-moongoo-type input:checked').val(),
            priceOtherRegion: parseInt($("select[name='modal-region-others']").val()),
            priceOtherType: $('.modal-region-others-type input:checked').val(),
        };
     
        eveUtils.ajaxPostCallJson(
            lb.urls.updatePreferenceUrl,
            JSON.stringify({production: productionSettingsTmp}),
            function(data) {
                utils.flashNotify('Production preferences successfuly saved.', 'success');
                productionSettings = productionSettingsTmp;
                _updateProductionConfigTable();
            },
            function(errorData) {
                utils.flashNotify(errorData.responseJSON['message'], 'danger');
            }
        )
    };
    
    var _updateProductionConfigTable = function() {
        $('#production-config .facility').html(eveData.facilities[productionSettings.facility].name);
        $('#production-config .meRig').html(eveData.structureRigs[productionSettings.meRig].meta);
        $('#production-config .teRig').html(eveData.structureRigs[productionSettings.teRig].meta);
        $('#production-config .security').html(eveData.securityStatus[productionSettings.security]);
        $('#production-config .system').html(productionSettings.system);
        $('#production-config .componentFacility').html(eveData.facilities[productionSettings.componentFacility].name);
        $('#production-config .componentMeRig').html(eveData.structureRigs[productionSettings.componentMeRig].meta);
        $('#production-config .componentTeRig').html(eveData.structureRigs[productionSettings.componentTeRig].meta);
        $('#production-config .componentSecurity').html(eveData.securityStatus[productionSettings.componentSecurity]);
        $('#production-config .componentSystem').html(productionSettings.componentSystem);
        $('#production-config .priceMineralRegion').html(regions[productionSettings.priceMineralRegion]);
        $('#production-config .priceMineralType').html(productionSettings.priceMineralType);
        $('#production-config .pricePiRegion').html(regions[productionSettings.pricePiRegion]);
        $('#production-config .pricePiType').html(productionSettings.pricePiType);
        $('#production-config .priceMoongooRegion').html(regions[productionSettings.priceMoongooRegion]);
        $('#production-config .priceMoongooType').html(productionSettings.priceMoongooType);
        $('#production-config .priceOtherRegion').html(regions[productionSettings.priceOtherRegion]);
        $('#production-config .priceOtherType').html(productionSettings.priceOtherType);
        if(eveData.facilities[productionSettings.facility].structure) {
            $('.structure-main').show();
        } else {
            $('.structure-main').hide();
        }
        if(eveData.facilities[productionSettings.componentFacility].structure) {
            $('.structure-comp').show();
        } else {
            $('.structure-comp').hide();
        }
    }
    
    /**
     * Init all modals
     * @private
     */
    var _initModal = function() {
        _initProdModal();
        $('#open-modal-prod-settings').on('click', function() {
            $('#modalConfigProd').modal('show');
        });
        $('#modal-prod-apply').on('click', _onModalProdSettingsApply);
    };

    var _initTypeahead = function() {
        eveUtils.initSolarSystemTypeahead('#modal-system-main');
        eveUtils.initSolarSystemTypeahead('#modal-system-comp');
    };
    
    /**
     * Runner function
     */
    var run = function() {
        _initModal();
        _initTypeahead();
    };

    // -------------------------------------------------
    // return object
    //
    return {
        // functions
        run: run,
        inventionSettings: inventionSettings,
        researchSettings: researchSettings,
        productionSettings: productionSettings,
        regions:regions,
    };
})(jQuery, lb, utils, eveUtils, eveData);

lb.registerModule('accountDashboard', accountDashboard);
