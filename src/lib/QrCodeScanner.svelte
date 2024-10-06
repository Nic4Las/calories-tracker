<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import {
    Html5QrcodeScanner,
    type Html5QrcodeResult,
    Html5QrcodeScanType,
    Html5QrcodeSupportedFormats,
    Html5QrcodeScannerState,
  } from "html5-qrcode";

  export let width: number;
  export let height: number;
  export let paused: boolean = false;
  export let formatsToSupport: Array<Html5QrcodeSupportedFormats> = [
    Html5QrcodeSupportedFormats.QR_CODE,
    Html5QrcodeSupportedFormats.AZTEC,
    Html5QrcodeSupportedFormats.CODABAR,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.CODE_93,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.DATA_MATRIX,
    Html5QrcodeSupportedFormats.MAXICODE,
    Html5QrcodeSupportedFormats.ITF,
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.PDF_417,
    Html5QrcodeSupportedFormats.RSS_14,
    Html5QrcodeSupportedFormats.RSS_EXPANDED,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
  ];
  export let supportedScanTypes: Array<Html5QrcodeScanType> = [
    Html5QrcodeScanType.SCAN_TYPE_CAMERA,
    Html5QrcodeScanType.SCAN_TYPE_FILE,
  ];

  interface QrCodeScannerEvent {
    detect: { decodedText: string };
    error: { message: string };
  }
  const dispatch = createEventDispatcher<QrCodeScannerEvent>();

  function onScanSuccess(
    decodedText: string,
    decodedResult: Html5QrcodeResult,
  ): void {
    dispatch("detect", { decodedText });
  }

  // usually better to ignore and keep scanning
  function onScanFailure(message: string) {
    dispatch("error", { message });
  }

  let scanner: Html5QrcodeScanner;
  onMount(() => {
    scanner = new Html5QrcodeScanner(
      "qr-scanner",
      {
        fps: 10,
        qrbox: { width, height },
        aspectRatio: 1,
        supportedScanTypes: supportedScanTypes,
        formatsToSupport: formatsToSupport,
      },
      false, // non-verbose
    );
    scanner.render(onScanSuccess, onScanFailure);
  });

  // pause/resume scanner to avoid unintended scans
  $: togglePause(paused);
  function togglePause(paused: boolean): void {
    if (paused && scanner?.getState() === Html5QrcodeScannerState.SCANNING) {
      scanner?.pause();
    } else if (scanner?.getState() === Html5QrcodeScannerState.PAUSED) {
      scanner?.resume();
    }
  }
</script>

<div id="qr-scanner" class={$$props.class} />
