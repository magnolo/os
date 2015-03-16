'use strict';
angular.module('osApp').config(function($stateProvider, $urlRouterProvider, USER_ROLES, AUTH_EVENTS, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                '': {
                    controller: 'MainCtrl',
                    templateUrl: 'views/main.html'
                }
            },
            data: {
                pageTitle: 'Open Science',
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'login': {
                    controller: 'LoginCtrl',
                    templateUrl: 'views/login.html'
                }
            },
            data: {
                pageTitle: 'Anmelden // Open Science'
            }
        })
        .state('calendar', {
            url: '/admin/calendar?action',
            views: {
                'admin': {
                    templateUrl: 'views/admin/calendar.html',
                    controller: 'CalendarCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Kalender // OpenScience'
            }
        })
        .state('event', {
            url: '/admin/event/:id/:type',
            views: {
                'admin': {
                    templateUrl: 'views/admin/event.html',
                    controller: 'EventCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Event // OpenScience'
            }
        })
        .state('events', {
            url: '/admin/events',
            views: {
                'admin': {
                    templateUrl: 'views/admin/events.html',
                    controller: 'EventsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Veranstaltungen // OpenScience'
            }
        })
        .state('bookings', {
            url: '/admin/bookings',
            views: {
                'admin': {
                    templateUrl: 'views/admin/bookings.html',
                    controller: 'BookingsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Buchungen // OpenScience'
            }
        })
        .state('emailconfig', {
            url: '/admin/emailconfig',
            views: {
                'admin': {
                    templateUrl: 'views/admin/emailconfig.html',
                    controller: 'EmailconfigCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'E-Mails // Buchungen // OpenScience'
            }
        })
        .state('shorturls', {
            url: '/admin/shorturls',
            views: {
                'admin': {
                    templateUrl: 'views/admin/shorturls.html',
                    controller: 'ShorturlsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'ShortUrls // OpenScience'
            }
        })
        .state('classes', {
            url: '/admin/classes',
            views: {
                'admin': {
                    templateUrl: 'views/admin/classes.html',
                    controller: 'ClassesCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Kurse // OpenScience'
            }
        })
        .state('class', {
            url: '/admin/classes/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/class.html',
                    controller: 'ClassCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Kurs // OpenScience'
            }
        })
        .state('team', {
            url: '/admin/team',
            views: {
                'admin': {
                    templateUrl: 'views/admin/team.html',
                    controller: 'TeamCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Team // OpenScience'
            }
        })
        .state('member', {
            url: '/admin/team/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/member.html',
                    controller: 'MemberCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'TeamMember // OpenScience'
            }
        })
        .state('partners', {
            url: '/admin/förderer',
            views: {
                'admin': {
                    templateUrl: 'views/admin/partners.html',
                    controller: 'PartnersCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Förderer // OpenScience'
            }
        })
        .state('partner', {
            url: '/admin/förderer/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/partner.html',
                    controller: 'PartnerCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Förderer // OpenScience'
            }
        })
        .state('coops', {
            url: '/admin/mitglieder',
            views: {
                'admin': {
                    templateUrl: 'views/admin/coops.html',
                    controller: 'CoopsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Mitglieder // OpenScience'
            }
        })
        .state('coop', {
            url: '/admin/mitglieder/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/coop.html',
                    controller: 'CoopCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Mitglied // OpenScience'
            }
        })
        .state('tags', {
            url: '/admin/tags',
            views: {
                'admin': {
                    templateUrl: 'views/admin/tags.html',
                    controller: 'TagsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Schlagwörter // OpenScience'
            }
        })
        .state('glossar', {
            url: '/admin/glossar',
            views: {
                'admin': {
                    templateUrl: 'views/admin/glossar.html',
                    controller: 'GlossarCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Glossar // OpenScience'
            }
        })
        .state('quiz', {
            url: '/admin/quiz',
            views: {
                'admin': {
                    templateUrl: 'views/admin/quiz.html',
                    controller: 'QuizCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Quiz // OpenScience'
            }
        })
        .state('quizdetails', {
            url: '/admin/quiz/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/quizdetails.html',
                    controller: 'QuizdetailsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Quiz // OpenScience'
            }
        })
        .state('guestbook', {
            url: '/admin/guestbook',
            views: {
                'admin': {
                    templateUrl: 'views/admin/guestbook.html',
                    controller: 'GuestbookCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Gästebuch // OpenScience'
            }
        })
        .state('faqs', {
            url: '/admin/faqs',
            views: {
                'admin': {
                    templateUrl: 'views/admin/faqs.html',
                    controller: 'FaqsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'FAQs // OpenScience'
            }
        })
        .state('users', {
            url: '/admin/accounts',
            views: {
                'admin': {
                    templateUrl: 'views/admin/users.html',
                    controller: 'UserCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Accounts // OpenScience'
            }
        })
        .state('newsletters', {
            url: '/admin/newsletters',
            views: {
                'admin': {
                    templateUrl: 'views/admin/newsletters.html',
                    controller: 'NewslettersCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Newsletters // OpenScience'
            }
        }).state('newsletter', {
            url: '/admin/newsletters/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/newsletter.html',
                    controller: 'NewsletterCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'Newsletter // OpenScience'
            }
        })
        .state('elabs', {
            url: '/admin/elabs',
            views: {
                'admin': {
                    templateUrl: 'views/admin/elabs.html',
                    controller: 'ElabsCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'eLabs // OpenScience'
            }
        })
        .state('elab', {
            url: '/admin/elabs/:id',
            views: {
                'admin': {
                    templateUrl: 'views/admin/elab.html',
                    controller: 'ElabCtrl'
                }
            },
            data: {
                authorizedRoles: USER_ROLES.admin,
                pageTitle: 'eLabs // OpenScience'
            }
        })
        .state('tag', {
            url: '/tag/:name',
            views: {
                '': {
                    controller: 'TagCtrl',
                    templateUrl: 'views/tag.html'
                }
            }
        })
        .state('search', {
            url: '/search/:name',
            views: {
                '': {
                    controller: 'SearchCtrl',
                    templateUrl: 'views/search.html'
                }
            }
        })
        .state('uns', {
            url: '/uns',
            views: {
                '': {
                    templateUrl: 'views/uns/index.html',
                    controller: 'UnsCtrl'
                },
                'content@uns': {
                    templateUrl: 'views/uns/main.html',
                    controller: 'UnsmainCtrl'
                }
            },
            data: {
                pageTitle: 'Über uns // OpenScience'
            }
        })
        .state('uns.wer', {
            url: '/wer-wir-sind',
            views: {
                'content@uns': {
                    templateUrl: 'views/uns/wer.html',
                    controller: 'UnswerCtrl'
                }
            },
            data: {
                pageTitle: 'Wer wir sind // OpenScience'
            }
        })
        .state('uns.was', {
            url: '/was-wir-tun',
            views: {
                'content@uns': {
                    templateUrl: 'views/uns/was.html',
                    controller: 'UnswasCtrl'
                }
            },
            data: {
                pageTitle: 'Was wir tun // OpenScience'
            }
        })
        .state('uns.foerderer', {
            url: '/fördergeber',
            views: {
                'content@uns': {
                    templateUrl: 'views/uns/partners.html',
                    controller: 'UnspartnerCtrl'
                }
            },
            data: {
                pageTitle: 'Fördergeber // OpenScience'
            }
        })
        .state('uns.mitglieder', {
            url: '/mitgliedsgesellschaften',
            views: {
                'content@uns': {
                    templateUrl: 'views/uns/coops.html',
                    controller: 'UnscoopsCtrl'
                }
            },
            data: {
                pageTitle: 'Mitgliedsgesellschaften // OpenScience'
            }
        })
        .state('uns.kontakt', {
            url: '/kontakt',
            views: {
                'content@uns': {
                    templateUrl: 'views/uns/contact.html',
                    controller: 'UnscontactCtrl'
                }
            },
            data: {
                pageTitle: 'Kontakt // OpenScience'
            }
        })
        .state('uns.impressum', {
            url: '/impressum',
            views: {
                'content@uns': {
                    templateUrl: 'views/uns/impressum.html',
                    controller: 'UnsimpressumCtrl'
                }
            },
            data: {
                pageTitle: 'Impressum // OpenScience'
            }
        })
        .state('uns.wer.person', {
            url: '/:name'
        })
        .state('vol', {
            url: '/vol',
            views: {
                '': {
                    templateUrl: 'views/vol/vol.html',
                    controller: 'VolCtrl'
                },
                'content@vol': {
                    templateUrl: 'views/section.main.html',
                    controller: 'VolmainCtrl'
                }
            },
            data: {
                pageTitle: 'Vienna Open Lab'
            }
        })
        .state('vol.kurse', {
            url: '/kurse',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.kurse.html',
                    controller: 'VolkurseCtrl'
                }
            }
        })
        .state('vol.kurse.kurs', {
            url: '/:kurs'
        })
        .state('vol.kalender', {
            url: '/kalender',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.kalender.html',
                    controller: 'VolkalenderCtrl'
                }
            },
            data: {
                pageTitle: 'Kalender // ViennaOpenLab'
            }
        })
        .state('vol.kalender.lab', {
            url: '/:lab'
        })
        .state('vol.kalender.lab.date', {
            url: '/:date'
        })
        .state('vol.einzelanmeldung', {
            url: '/einzelanmeldung',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.einzelanmeldung.html',
                    controller: 'VoleinzelanmeldungCtrl'
                }
            },
            data: {
                pageTitle: 'Einzelanmeldung // ViennaOpenLab'
            }
        })
        .state('vol.einzelanmeldung.kurs', {
            url: '/:kurs'
        })
        .state('vol.einzelanmeldung.kurs.date', {
            url: '/:date'
        })
        .state('vol.gruppenbuchung', {
            url: '/gruppenbuchung',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.gruppenbuchung.html',
                    controller: 'VolgruppenbuchungCtrl'
                }
            },
            data: {
                pageTitle: 'Gruppenbuchung // ViennaOpenLab'
            }
        })
        .state('vol.gruppenbuchung.kurs', {
            url: '/:kurs'
        })
        .state('vol.gruppenbuchung.kurs.date', {
            url: '/:date'
        })
        .state('vol.seminare', {
            url: '/seminare',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.seminare.html',
                    controller: 'VolseminareCtrl'
                }
            },
            data: {
                pageTitle: 'Seminare // ViennaOpenLab'
            }
        })
        .state('vol.seminare.seminar', {
            url: '/:seminar'
        })
        .state('vol.camps', {
            url: '/summer-science-camps',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.camps.html',
                    controller: 'VolcampsCtrl'
                }
            },
            data: {
                pageTitle: 'Summer Science Camps // ViennaOpenLab'
            }
        })
        .state('vol.camps.camp', {
            url: '/:camp'
        })

    .state('vol.faq', {
            url: '/faq',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.faq.html',
                    controller: 'VolfaqCtrl'
                }
            },
            data: {
                pageTitle: 'FAQ // ViennaOpenLab'
            }
        })
        .state('vol.guestbook', {
            url: '/gaestebuch',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.guestbook.html',
                    controller: 'VolguestbookCtrl'
                }
            },
            data: {
                pageTitle: 'Gästebuch // ViennaOpenLab'
            }
        })
        .state('vol.gallery', {
            url: '/fotogalerie',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.gallery.html',
                    controller: 'VolgalleryCtrl'
                }
            },
            data: {
                pageTitle: 'Fotogalerie // ViennaOpenLab'
            }
        })
        .state('vol.gallery.details', {
            url: '/:id'
        })
        .state('vol.kontakt', {
            url: '/kontakt',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.kontakt.html',
                    controller: 'VolkontaktCtrl'
                }
            },
            data: {
                pageTitle: 'Kontakt // ViennaOpenLab'
            }
        })
        .state('voluns', {
            url: '/vol/über-uns',
            views: {
                '': {
                    templateUrl: 'views/vol/vol.uns.html',
                    controller: 'VolunsCtrl'
                },
                'content@voluns': {
                    templateUrl: 'views/vol/vol.uns.main.html',
                    controller: 'VolunsmainCtrl'
                }
            },
            data: {
                pageTitle: 'Über uns // ViennaOpenLab'
            }
        })
        .state('voluns.konzept', {
            url: '/konzept',
            views: {
                'content@voluns': {
                    templateUrl: '/views/vol/vol.uns.konzept.html',
                    controller: 'VolunskonzeptCtrl'
                }
            },
            data: {
                pageTitle: 'Konzept // ViennaOpenLab'
            }
        })
        .state('voluns.team', {
            url: '/team',
            views: {
                'content@voluns': {
                    templateUrl: '/views/vol/vol.uns.team.html',
                    controller: 'VolunsteamCtrl'
                }
            },
            data: {
                pageTitle: 'Team // ViennaOpenLab'
            }
        })
        .state('voluns.team.person', {
            url: '/:name'
        })
        .state('voluns.organisation', {
            url: '/organisation',
            views: {
                'content@voluns': {
                    templateUrl: 'views/vol/vol.uns.organisation.html',
                    controller: 'VolunsoranisationCtrl'
                }
            },
            data: {
                pageTitle: 'Organisation // ViennaOpenLab'
            }
        })
        .state('voluns.fakten', {
            url: '/fakten',
            views: {
                'content@voluns': {
                    templateUrl: 'views/vol/vol.uns.fakten.html',
                    controller: 'VolunsfaktenCtrl'
                }
            },
            data: {
                pageTitle: 'Fakten // ViennaOpenLab'
            }
        })
        .state('vol.elab', {
            url: '/elab',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.elab.html',
                    controller: 'VolelabCtrl'
                }
            },
            data: {
                pageTitle: 'eLAB // ViennaOpenLab'
            }
        })
        .state('vol.elab.section', {
            url: '/:id',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.elab.section.html',
                    controller: 'VolelabsectionCtrl'
                }
            },
            data: {
                pageTitle: 'eLAB // ViennaOpenLab'
            }
        })
        .state('vol.elab.section.details', {
            url: '/:name',
            views: {
                'content@vol': {
                    templateUrl: 'views/vol/vol.elab.details.html',
                    controller: 'VolelabdetailsCtrl'
                }
            },
            data: {
                pageTitle: 'eLAB // ViennaOpenLab'
            }
        })
        .state('vol.categorie', {
            url: '/:categorie',
            views: {
                'content@vol': {
                    templateUrl: 'views/section.categorie.html',
                    controller: 'WissencategorieCtrl'
                }
            },
            data: {
                section: 'vol'
            }
        })
        .state('vol.categorie.article', {
            url: '/:article'
        })
        .state('section', {
            url: '/:section',
            views: {
                '': {
                    templateUrl: 'views/section.html',
                    controller: 'WissenCtrl'
                },
                'content@section': {
                    templateUrl: 'views/section.main.html',
                    controller: 'WissenmainCtrl'
                }
            }
        })
        .state('section.categorie', {
            url: '/:categorie',
            views: {
                'content@section': {
                    templateUrl: 'views/section.categorie.html',
                    controller: 'WissencategorieCtrl'
                }
            }
        })
        .state('section.categorie.article', {
            url: '/:article'
        });

    //$locationProvider.html5Mode(true).hashPrefix('!');
});