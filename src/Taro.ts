export class Taro {

}

class __TaroReact {
    createElement(tagName: string, args: Record<string, any>, children: any) {
        console.log(tagName, args);
    }
}

(window as any).React = new __TaroReact();