class Emitter {
    constructor() {
        this.subscribers = [];
    }
    subscribe(cb) {
        this.subscribers.push(cb);
    }
    notifySubscribers() {
        for (let cb of this.subscribers) {
            cb();
        }
    }
}

class Subscriber {
    constructor(em) {
        em.subscribe(this.onRecieveNotification.bind(this));
        this.a = 0;
    }
    onRecieveNotification() {
        this.a++;
        console.log(this.a);
    }
}

let em = new Emitter();
for (let i=0; i<100000; i++) {
    let s = new Subscriber(em);
}