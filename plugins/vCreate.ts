import { DirectiveBinding, ObjectDirective } from "vue";

interface CreateDirectiveValue {
  createEnded: () => {};
  enabled: boolean;
}

export default defineNuxtPlugin(({ vueApp }) => {
  let instanceId = 0;
  const directiveData: { [p: string]: CreateDirectiveValue } = {};

  // Store the initial mouse coordinates
  function handleMouseDown(e: MouseEvent) {
    console.log("vCreate handleMouseDown", e.currentTarget);
    e.stopPropagation();

    const el = e.currentTarget as HTMLElement;

    function handleMouseMove(e: MouseEvent) {
      e.stopPropagation();
      e.preventDefault();

    }

    function handleMouseUp(e: MouseEvent) {
      console.log("vCreate handleMouseUp", e.currentTarget);
      e.stopPropagation();

      directiveData[el.dataset.vCreateId!].createEnded();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  const vCreate: ObjectDirective = {
    mounted(
      el: HTMLElement,
      binding: DirectiveBinding<CreateDirectiveValue>,
    ) {
      el.dataset.vCreateId = (instanceId++).toString();
      directiveData[el.dataset.vCreateId] = binding.value;
      el.addEventListener("mousedown", handleMouseDown);
    },
    updated(
      el: any,
      binding: DirectiveBinding<any>,
      vnode: VNode<any, any>,
      prevVNode: VNode<any, any>,
    ): void {
      directiveData[el.dataset.vCreateId!] = binding.value;
    },

    unmounted(
      el: HTMLElement,
      binding: DirectiveBinding<CreateDirectiveValue>,
    ) {
      el.removeEventListener("mousedown", handleMouseDown);
      delete directiveData[el.dataset.vCreateId!];
    },
  };
  vueApp.directive("create", vCreate);
});
