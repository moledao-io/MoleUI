/**
 * Unlock sound, inlined as a data URI so the package needs no bundler asset config.
 *
 * Source: mixkit-gear-fast-lock-tap-2857.wav — 30,066 bytes, 44.1 kHz stereo PCM, 170 ms.
 * Output: ./assets/lock-unlock.webm — 885 bytes (−97%), Opus 16 kbps mono, 20 ms fade-out tail.
 * Opus in WebM plays in Chrome, Edge, Firefox and Safari 17+; elsewhere the icon simply stays silent.
 *
 * Regenerate:
 *   ffmpeg -i src.wav -af afade=t=out:st=0.150:d=0.02 -ac 1 -c:a libopus -b:a 16k -vbr on \
 *     -application audio -map_metadata -1 -fflags +bitexact -flags:a +bitexact -write_crc32 0 lock-unlock.webm
 */
import type { AnimatedIconSound } from '../../types';

export const UNLOCK_SOUND: AnimatedIconSound = {
  type: 'audio/webm; codecs="opus"',
  src: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAANFEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEwTbuMU6uEHFO7a1OsggMv7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBmQAAAAAAAFlSua+WuAQAAAAAAAFzXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhkFfT1BVU1aqg2MuoFa7hATEtACDgQLhkZ+BAbWIQOdwAAAAAABiZIEQY6KTT3B1c0hlYWQBATgBgLsAAAAAABJUw2fRc3POY8CLY8WIAAAAAAAAAAFnyJlFo4dFTkNPREVSRIeMTGF2YyBsaWJvcHVzZ8ihRaOIRFVSQVRJT05Eh5MwMDowMDowMC4xNzgwMDAwMDAAH0O2dUGj54EAo7KBAACAeIK3SX2vI3/t1m8raPcKUkps/QXTkMd1B05ShT1pKRzw75+ztfd0AJVat9f8iaOugQAVgHiFoMAO07/vRIOmIxHBFtJalDm5hFMohHZQnZxxYocYljle4CIrMWdeU6OqgQApgHiTdiIgWMcKoWq6O+xAEUSIrAZW+/iHO/XSgado/+gHz1RKbS4Ro6+BAD2AeJFzikiWXXuJ36VGKlcpVqdJpWVz29AOOmx/FHfGywDTvfn6m0hygI8DdKOygQBRgHiDnoYoHW4zfQquVnwXyKSoObs0H0gSzMmpZGtkTUPooaYcpfIgUsZqPR0yLLGjqoEAZYB4ly5ovkKKFDD8D7U8CjBfDhxsOR8C0dYC/MEnz/N3WqRGdM3RG6OsgQB5gHiUVFkpACH76f/W3oKSK/isZQn4xLWx/N22E6cEJOZMRPsj3GuALgmjpoEAjYB4Pma5BbfPNA5yKjSWuqmi1choK2B5LpaI+gYBQ7AKodGIoKehn4EAoQB4Bh6AAVI7o/YueWI4wyPjYP/XmW3xrUc1Xmd1ooM1Z+AcU7trkbuPs4EAt4r3gQHxggGG8IED',
};
