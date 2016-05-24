'use strict';

angular
    .module('osApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'wu.masonry',
        'ngAnimate',
        'angular-loading-bar',
        'infinite-scroll',
        'ngTouch',
        'duScroll',
        'angular-inview',
        'ng-context-menu',
        'autocomplete',
        'angulartics',
        'angulartics.google.analytics',
        'djds4rce.angular-socialshare',
        'mgcrea.ngStrap.helpers.dateParser',
        'mgcrea.ngStrap.tooltip',
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.alert',
        'mgcrea.ngStrap.datepicker',
        'mgcrea.ngStrap.timepicker',
        'mgcrea.ngStrap.dropdown',
        'mgcrea.ngStrap.aside',
        'mgcrea.ngStrap.collapse',
        'pascalprecht.translate',
        'angularMoment',
        'angularFileUpload',
        'localytics.directives',
        'xeditable',
        'ct.ui.router.extras',
        'ui.calendar',
        'ui.sortable',
        'bsTable',
        'ui.checkbox',
        'FBAngular',
        'ckeditor'
    ]).value('froalaConfig', {
        inlineMode: false,
        toolbarFixed: false,
        placeholder: '',
        language: 'de',
        fileUploadURL: "/upload_file",
        buttons: ["formatBlock", "bold", "italic", "underline", "align", "insertOrderedList", "insertUnorderedList", "createLink", "insertImage", "insertVideo", "removeFormat"]
    }).config(function($analyticsProvider){
      $analyticsProvider.virtualPageviews(false);
    }).run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }).run(function($FB) {
        $FB.init('593221674063771');
    }).run(function(amMoment) {
        amMoment.changeLocale('de');
    }).config(function($modalProvider) {
        angular.extend($modalProvider.defaults, {
            animation: 'am-slide-top'
        });
    }).config(function($datepickerProvider) {
        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'dd.MM.yyyy',
            startWeek: 1,
            autoclose: true,
            modelDateFormat: 'yyyy-MM-dd HH:mm:ss',
            useNative: true,
            dateType: 'string'
        });
    }).config(function($timepickerProvider) {
        angular.extend($timepickerProvider.defaults, {
            timeFormat: 'HH:mm',
            length: 7
        });
    }).config(function($translateProvider) {
        $translateProvider.translations('de', {
            WHO: 'Wer wir sind',
            WHAT: 'Was wir tun',
            FUNDING: 'Fördergeber',
            SCIENCE_UPDATES: 'Wissen',
            PROJECTS: 'Projekte',
            SCHULCORNER: 'Schulcorner',
            MEMBERS: 'Mitgliedsgesellschaften',
            FUNDED: 'Unsere aktuellen Fördergeber',
            READ_MORE: 'mehr lesen',
            MORE: 'Weiterführendes',
            HANDS_ON: 'Das Molekularbiologische Mitmachlabor',
            FIND_MORE: 'mehr erfahren',
            INITIATIVE: 'Eine gemeinsame Initiative von',
            SORT: 'sortieren nach',
            CURRENT: 'Laufend',
            PAST: 'Abgeschlossen',
            AGE: 'Alter',
            BOOKINGS: 'Kalender',
            SOLO_REGISTRATION: 'Einzelanmeldung',
            GROUP_REGISTRATION: 'Gruppenbuchung',
            CAMPS: 'Summer Science Camp',
            FAQ: 'FAQ',
            IMPRESSUM: 'Impressum',
            CONTACT: 'Kontakt',
            GUESTBOOK: 'Gästebuch',
            VISITORS: 'BesucherInnnen',
            AVAILABLE_DATES: 'freie Einzeltermine',
            AVAILABLE_DATES_GROUPS: 'freie Gruppentermine',
            FULLY_BOOKED: 'Ausgebucht',
            TODAY: 'Heute',
            FULL_DAY: 'Ganztags',
            REGISTRATION: 'Anmeldung',
            ABOUT_US: 'Über uns',
            IDEA: 'Konzept',
            TEAM: 'Team',
            ORGANIZATION: 'Organisation',
            FACTS: 'Zahlen und Fakten',
            THE_TEAM: 'Das Team',
            OUR_TEAM: 'Unser Team',
            ADVISORY_BOARD: 'Der Vorstand',
            WORKSHOPS: 'Kurse/Seminare',
            GALLERY: 'Bildgalerie',
            PHOTO_GALLERY: 'Fotogalerie',
            MATERIALS: 'Kursunterlagen',
            LOADING_COURSE: 'Kurse werden geladen',
            NO_DATES: 'im Moment ist leider kein Termin verfügbar',
            LOADING_DATES: 'Termine werden geladen',
            CHOOSE_COURSE: 'Kurs auswählen',
            FEES: 'Kosten',
            DURATION: 'Dauer',
            SELECT_DATE: 'Termin auswählen',
            SOLO_DATES: 'Einzeltermine',
            SEND: 'Buchen',
            BOOK: 'Buchen',
            BOOK_WAIT: 'Anfrage wird gesendet...',
            BOOK_SUCCESS: 'Kursbuchung eingelangt',
            BOOK_SUCCESS_MESSAGE: 'Vielen Dank für ihre Anmeldung. Sie erhalten in Kürze eine Bestätigung zur Anmeldung an die E-Mailadresse:',
            BOOK_ERROR: 'Anfrageproblem',
            BOOK_ERROR_MESSAGE: 'Leider konnte die Anmeldung nicht versendet werden. Bitte versuchen es nochmal. Sollte dass Problem weiterhin auftreten kontaktieren Sie uns bitte unter:',
            GROUP: 'Gruppe',
            SEARCHING_TIME_SLOT: 'Freie Termine werden gesucht',
            NOT_AVAILABLE: 'Derzeit ist leider kein Termin verfügbar!',
            WHEN: 'Wann?',
            SELECT_PARTICIPANTS: 'Teilnehmeranzahl wählen',
            NUMBER_PARTICIPANTS: 'Wie viele Teilnehmer?',
            FILL_DETAILS: 'Füllen Sie das Kontaktformular aus',
            FIRSTNAME: 'Vorname',
            LASTNAME: 'Nachname',
            ADDRESS: 'Adresse',
            COMPANY: 'Institution',
            ZIP: 'PLZ/Ort',
            PHONE: 'Telefon',
            MAIL: 'E-Mail',
            REMARKS: 'Nachricht',
            SEND_REG: 'Anmelden',
            REG_SEND_ERROR: 'Leider konnte die Anmeldung nicht versendet werden.',
            REG_SEND_SUCCESS: 'Vielen Dank für Ihr Interesse. Ihre Kursanmeldung ist erfolgreich eingelangt.',
            SEARCH: 'Suche nach Themen oder Begriffen',
            SEARCHRESULT: 'Suche nach',
            TAG: 'Schlagwort',
            NEW_ENTRY: 'Neuer Eintrag',
            MORNING_AFTERNOON: 'Vor- & Nachmittags',
            SUBJECT: 'Betreff',
            POST: 'Senden',
            HOURS: 'Stunden',
            AND: 'und',
            SECURITY_QUESTION: 'Sicherheitsabfrage',
            SECURITY_WRONG: 'Das Ergebnis ist leider falsch!',
            CANCEL: 'Abbrechen',
            NEXT: 'Weiter',
            SEAT:'Platz',
            SEATS: 'Plätze',
            LEFT: 'frei',
            LEHRER_SEMINAR: 'LehrerInnen-Seminar'
        });
        $translateProvider.translations('en', {
            WHO: 'Who we are',
            WHAT: 'What we do',
            FUNDING: 'Funding',
            SCIENCE_UPDATES: 'Science Updates',
            PROJECTS: 'Projects',
            SCHULCORNER: 'School Corner',
            MEMBERS: 'Members',
            FUNDED: 'We are funded by',
            READ_MORE: 'read more',
            MORE: 'more',
            HANDS_ON: 'The hands-on lab that allows everybody to participate in practical work in life sciences',
            FIND_MORE: 'Find out more',
            INITIATIVE: 'Vienna Open Lab is a joint initiative of',
            SORT: 'sort by ',
            CURRENT: 'Current',
            PAST: 'Past',
            AGE: 'Age',
            BOOKINGS: 'Current Bookings',
            SOLO_REGISTRATION: 'Individual Registration',
            GROUP_REGISTRATION: 'Group Registration ',
            CAMPS: 'Summer Science Camps',
            FAQ: 'FAQ',
            IMPRESSUM: 'Impressum',
            CONTACT: 'Contact',
            GUESTBOOK: 'Guestbook',
            VISITORS: 'Visitors',
            AVAILABLE_DATES: 'Dates available for individuals',
            AVAILABLE_DATES_GROUPS: 'Dates available for groups',
            FULLY_BOOKED: 'Fully booked',
            TODAY: 'Today',
            FULL_DAY: 'Full Day',
            REGISTRATION: 'Registration',
            ABOUT_US: 'About Us',
            IDEA: 'Idea',
            TEAM: 'Team',
            ORGANIZATION: 'Organization',
            FACTS: 'Facts & Numbers',
            THE_TEAM: 'Team',
            OUR_TEAM: 'Our Team',
            ADVISORY_BOARD: 'Advisory Board',
            WORKSHOPS: 'Workshops/Trainings',
            GALLERY: 'Gallery',
            PHOTO_GALLERY: 'Gallery',
            MATERIALS: 'Materials',
            LOADING_COURSE: 'Loading',
            LOADING_DATES: 'Loading',
            NO_DATES: 'at the moment there are no dates available',
            CHOOSE_COURSE: 'Choose Workshop',
            FEES: 'Fees',
            DURATION: 'Duration',
            SELECT_DATE: 'Select Date',
            SOLO_DATES: 'Dates for Individuals',
            SEND: 'send',
            BOOK: 'book',
            BOOK_WAIT: 'Registration is on the way...',
            BOOK_SUCCESS: 'Registration success',
            BOOK_SUCCESS_MESSAGE: 'Thank you for your registration. A confirmation email with all the details has been sent to:',
            BOOK_ERROR: 'Registration failed',
            BOOK_ERROR_MESSAGE: 'Something didnt work. There has been a problem sending your registration. Please try again or contact us:',
            GROUP: 'Group',
            SEARCHING_TIME_SLOT: 'Searching for open time slot',
            NOT_AVAILABLE: 'Currently Not Available!',
            WHEN: 'Which date?',
            SELECT_PARTICIPANTS: 'Select the number of participants',
            NUMBER_PARTICIPANTS: 'Number of Participants?',
            FILL_DETAILS: 'Fill in your contact details',
            FIRSTNAME: 'First name',
            LASTNAME: 'Last name',
            COMPANY: 'Company',
            ADDRESS: 'Address',
            ZIP: 'Zip code/City',
            PHONE: 'Telephone',
            MAIL: 'Email',
            REMARKS: 'Remarks',
            SEND_REG: 'Send',
            REG_SEND_ERROR: 'Sorry, registration could not be processed. Please try again or call +43 1 79044 4591',
            REG_SEND_SUCCESS: 'Thank you for your registration. We will contact you soon.',
            SEARCH: 'Search',
            SEARCHRESULT: 'Search',
            TAG: 'TAG',
            NEW_ENTRY: 'New Entry',
            MORNING_AFTERNOON: 'Morning and Afternoon',
            SUBJECT: 'Subject',
            POST: 'send',
            HOURS: 'hours',
            AND: 'and',
            SECURITY_QUESTION: 'Security question',
            SECURITY_WRONG: 'Your answer is wrong!',
            CANCEL: 'Cancel',
            NEXT: 'Next',
            SEAT:'Place',
            SEATS: 'Places',
            LEFT :'left',
            LEHRER_SEMINAR: 'Teacher Training'
        });
        // Nicht vergessen: die Standardsprache
        //$translateProvider.determinePreferredLanguage();
        $translateProvider.preferredLanguage('de');
        $translateProvider.useCookieStorage();
    })
    .constant('SETTINGS', {
        apiUri: 'http://www.openscience.or.at/api',
        baseUri: ''
    })
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        customer: 'customer',
        guest: 'guest'
    }).run(function($rootScope, $state, $location,$analytics, AuthService, FlashService, AUTH_EVENTS, $timeout) {

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.lastState = {
                state: fromState,
                params: fromParams
            };
            if (AuthService.isLoggedIn() == "true") {
                $rootScope.isLoggedIn = true;
            }
            var authorizedRoles = [];
            if (typeof toState.data != 'undefined') {
                if (typeof toState.data.authorizedRoles != 'undefined') {
                    authorizedRoles = toState.data.authorizedRoles;
                    if (!AuthService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        if (AuthService.isLoggedIn()) {
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        } else {
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        }
                    } else {
                        $rootScope.role = AuthService.getUserRole();
                    }
                }
            }
        });
        $rootScope.$on('$stateChangeSuccess', function (event, current) {
          $rootScope.subOpened = false;
          $timeout(function(){$analytics.pageTrack($location.path())}, 500);
        });
        $rootScope.$on(AUTH_EVENTS.notAuthorized, function(event, args) {
            FlashService.show('Zugriff nicht erlaubt!', 'Sie haben leider keine Rechte, um auf diesen Inhalt zuzugreifen!', 'danger');
            $state.go('home');
        });
        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event, args) {
            delete $rootScope.role;
            //console.log('login in');
            // $location.path('admin/login');
            FlashService.show('Zugriff nicht erlaubt!', 'Sie müssen sich zuerst anmelden', 'danger');
            $state.go('login');
        });
        $rootScope.ckeOptions = {
    			language: 'de',
    			//allowedContent: true,
    			entities: false,
    			skin: 'flat',
    			toolbarGroups: [{
    				name: 'clipboard',
    				groups: ['clipboard', 'undo']
    			}, {
    				name: 'insert',
    				groups: ['insert']
    			}, {
    				name: 'forms',
    				groups: ['forms']
    			}, {
    				name: 'document',
    				groups: ['mode', 'document', 'doctools']
    			}, {
    				name: 'others',
    				groups: ['others']
    			}, {
    				name: 'basicstyles',
    				groups: ['basicstyles', 'cleanup']
    			}, {
    				name: 'paragraph',
    				groups: ['list', 'blocks', 'align', 'bidi', 'paragraph']
    			}, {
    				name: 'styles',
    				groups: ['styles']
    			}, {
    				name: 'tools',
    				groups: ['tools']
    			}, {
    				name: 'editing',
    				groups: ['find', 'selection', 'spellchecker', 'editing']
    			}, {
    				name: 'links',
    				groups: ['links']
    			}, {
    				name: 'colors',
    				groups: ['colors']
    			}, {
    				name: 'about',
    				groups: ['about']
    			}],
    			removeButtons: 'Underline,Subscript,Superscript,About,Styles,Table,HorizontalRule,SpecialChar,Source,Anchor',
    			removePlugins: 'language,tableresize,tabletools,scayt,menubutton,contextmenu',
    			resize_maxwidth: 460,
    			resize_minwidth: 460,
    			width: 460,
    			filebrowserImageUploadUrl: 'http://www.openscience.or.at/assets/ajax/uploadContentImage.php?id=content&cat=articles',
    			extraPlugins: 'youtube,justify,uploadimage,image2,notification'
    		};
    });
