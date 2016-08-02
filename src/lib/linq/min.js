import minMax from './min-max';

export default function minIterable(source, selector = null) {
    minMax(source, false, selector);
}
