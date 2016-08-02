import minMax from './min-max';

export default function maxIterable(source, selector = null) {
    minMax(source, true, selector);
}
