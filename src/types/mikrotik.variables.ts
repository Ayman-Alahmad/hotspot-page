export class MikrotikVariables {
    /**
    *  MAC address of the user ("01:23:45:67:89:AB")
    */
    mac: string;
    /**
     * IP address of the client ("10.5.50.2")
     */
    ip: string;
    /**
     *  the name of the user ("John")
     */
    username: string;
    /**
     * link to login page including original URL requested ("http://10.5.50.1/login?dst=http://www.example.com/")
     */
    linklogin: string;
    /**
     * original URL requested ("http://www.example.com/")
     */
    linkorig: string;

    /**
     * error message, if something failed ("invalid username or password")
     */
    error: string;

    /**
     * a "yes/no" representation of whether the user has access to trial time. If users trial time has expired, the value is "no"
     */
    trial: string;
    /**
     * authentication method used by user
     */
    loginby: string;
    /** value of chap ID ("\371") */
    chapid: string;
    /**value of chap challenge ("\357\015\330\013\021\234\145\245\303\253\142\246\133\175\375\316") */
    chapchallenge: string;
    /** link to login page, not including original URL requested ("http://10.5.50.1/login") */
    linkloginonly: string;
    /** Multiple HotSpot page sets for the same HotSpot server are supported. They can be chosen by user (to select language) or automatically by JavaScript (to select PDA/regular version of HTML pages). */
    linkorigesc: string;
    /**hidden variable (use in Mikrotik router only) */
    macesc: string;
    /** RouterOS identity name ("MikroTik") */
    identity: string;
    /**
     *  user-friendly form of number of bytes received from the user ("15423")
     */
    bytesinnice: string;
    /** user-friendly form of number of bytes sent to the user ("11352") */
    bytesoutnice: string;
    /**
     *  session time left for the user ("5h" or "" if none)
     */
    sessiontimeleft: string;
    /** current session uptime ("10h2m33s") */
    uptime: string;
    /** status page refresh timeout ("1m30s" or "" if none) */
    refreshtimeout: string;
    /** link to status page ("http://10.5.50.1/status") */
    linkstatus: string;
    /** HotSpot server address ("10.5.50.1:80") */
    server_address: string;
    /** HotSpot server name (set in the /ip hotspot menu, as the name property) */
    server_name: string;
    constructor(post) {
        this.mac = post['mac'];
        this.ip = post['ip'];
        this.username = post['username'];
        this.linklogin = post['link-login'];
        this.linkorig = post['link-orig'];
        this.error = post['error'];
        this.trial = post['trial'];
        this.loginby = post['login-by'];
        this.chapid = post['chap-id'];
        this.chapchallenge = post['chap-challenge'];
        this.linkloginonly = post['link-login-only'];
        this.linkorigesc = post['link-orig-esc'];
        this.macesc = post['mac-esc'];
        this.identity = post['identity'];
        this.bytesinnice = post['bytes-in-nice'];
        this.bytesoutnice = post['bytes-out-nice'];
        this.sessiontimeleft = post['session-time-left'];
        this.uptime = post['uptime'];
        this.refreshtimeout = post['refresh-timeout'];
        this.linkstatus = post['link-status'];
        this.server_address = post['server-address'];
        this.server_name = post['server-name'];

    }
}