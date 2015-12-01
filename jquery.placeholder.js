/**
 * Created by zhangff on 2015/11/12.
 * 对不支持表单placeholder属性的浏览器做placeholder兼容
 */
;(function($) {

    // 如果浏览器支持placeholder,则直接返回
    if ("placeholder" in document.createElement("input")) {
        return;
    }

    $(function() {
        $(':input[placeholder]').not(':password').each(function() {
            setupPlaceholder($(this));
        });

        $(':password[placeholder]').each(function() {
            setupPasswords($(this));
        });

        $('form').submit(function() {
            clearPlaceholdersBeforeSubmit($(this));
        });
    });

    function setupPlaceholder(input) {

        var placeholderText = input.attr('placeholder');
        setPlaceholderOrFlagChanged(input, placeholderText);
        input.focus(function() {
            input.removeClass('empty');
            if (input.data('changed') === true) {
                return;
            }
            if (input.val() === placeholderText) {
                input.val('');
            }
        }).blur(function() {
            if (input.val() === '') {
                input.val(placeholderText).addClass('empty');
            }
        }).change(function() {
            input.data('changed', input.val() !== '');
        });
    }

    function setPlaceholderOrFlagChanged(input, text) {
        (input.val() === '' || input.val() === text) ? input.val(text).addClass('empty') : input.data('changed', true);
    }

    function setupPasswords(input) {
        var passwordPlaceholder = createPasswordPlaceholder(input);
        input.after(passwordPlaceholder);

        (input.val() === '') ? input.hide() : passwordPlaceholder.hide();

        $(input).blur(function() {
            if (input.val() !== '') {
                return;
            }
            input.hide();
            passwordPlaceholder.show();
        });

        $(passwordPlaceholder).focus(function() {
            input.show().focus();
            passwordPlaceholder.hide();
        });
    }

    function createPasswordPlaceholder(input) {
        return $('<input>').attr({
            placeholder: input.attr('placeholder'),
            value: input.attr('placeholder'),
            id: input.attr('id'),
            readonly: true
        }).addClass(input.attr('class')).addClass('empty');
    }

    function clearPlaceholdersBeforeSubmit(form) {
        form.find(':input[placeholder]').each(function() {
            if ($(this).data('changed') === true) {
                return;
            }
            if ($(this).val() === $(this).attr('placeholder')) {
                $(this).val('');
            }
        });
    }
})(jQuery);
