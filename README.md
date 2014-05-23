ChromeLogger
================

A keylogger and form grabber for Google Chrome that runs as an extension.

For a download link and usage instructions, visit the [project page][1].

ChromeLogger works by injecting javascript into all loaded web pages. The payload records keypresses using event listeners and saves them to Chrome's storage. Unlike other browser keyloggers, ChromeLogger runs natively in Chrome (on all OS's) without the need to install additional software.

The form grabber works in a similar way. Javascript is injected and event listeners are added for all forms. When a form is submitted, its data is saved to ChromeLogger's storage. This allows form data transferred over SSL to be saved in plaintext.

ChromeLogger's payload is written in pure JS and the log viewer is built using AngularJS. Please feel free to send pull requests and raise issues. 


  [1]: http://www.ericzhang.me/projects/chromelogger/