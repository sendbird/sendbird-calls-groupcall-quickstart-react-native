import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import type { AudioDeviceRoute, Participant, Room, SendbirdError } from '@sendbird/calls-react-native';
import { SendbirdCalls } from '@sendbird/calls-react-native';

import { AppLogger } from '../utils/logger';
import { useEffectAsync } from './useEffectAsync';
import { useForceUpdate } from './useForceUpdate';

export const useGroupCallRoom = (roomId: string) => {
  const forceUpdate = useForceUpdate();

  const { canGoBack, goBack } = useNavigation();

  const [room, setRoom] = useState<Room | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [currentAudioDeviceIOS, setCurrentAudioDeviceIOS] = useState<AudioDeviceRoute>({ inputs: [], outputs: [] });

  const toggleLocalParticipantAudio = () => {
    if (room?.localParticipant?.isAudioEnabled) {
      room.localParticipant.muteMicrophone();
    } else {
      room?.localParticipant?.unmuteMicrophone();
    }
  };

  const toggleLocalParticipantVideo = () => {
    if (room?.localParticipant?.isVideoEnabled) {
      room.localParticipant.stopVideo();
    } else {
      room?.localParticipant?.startVideo();
    }
  };
  const flipCameraFrontAndBack = async () => {
    try {
      await room?.localParticipant?.switchCamera();
    } catch (e) {
      AppLogger.info('[useGroupCallRoom::ERROR] RoomScreen switchCamera - ', e);
    }
  };

  useEffectAsync(async () => {
    const room = await SendbirdCalls.getCachedRoomById(roomId);
    if (room) {
      setRoom(room);
      setIsFetched(true);

      return room.addListener({
        onPropertyUpdatedManually() {
          forceUpdate();
        },

        onDeleted() {
          canGoBack() && goBack();
        },
        onError(e: SendbirdError, participant: Participant | null) {
          AppLogger.info('[useGroupCallRoom] onError(e, participant) - ', e, participant);
        },

        onRemoteParticipantEntered(participant: Participant) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onRemoteParticipantEntered(participant) - ', participant);
        },
        onRemoteParticipantExited(participant: Participant) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onRemoteParticipantExited(participant) - ', participant);
        },
        onRemoteParticipantStreamStarted(participant: Participant) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onRemoteParticipantStreamStarted(participant) - ', participant);
        },
        onRemoteVideoSettingsChanged(participant: Participant) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onRemoteVideoSettingsChanged(participant) - ', participant);
        },
        onRemoteAudioSettingsChanged(participant: Participant) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onRemoteAudioSettingsChanged(participant) - ', participant);
        },

        onAudioDeviceChanged({ platform, data }) {
          AppLogger.info('[useGroupCallRoom] onAudioDeviceChanged(platform, data) - ', platform, data);

          if (platform === 'ios') {
            setCurrentAudioDeviceIOS(data.currentRoute);
          } else {
            forceUpdate();
          }
        },

        onCustomItemsUpdated(updatedKeys: string[]) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onCustomItemsUpdated(updatedKeys) - ', updatedKeys);
        },
        onCustomItemsDeleted(deletedKeys: string[]) {
          forceUpdate();
          AppLogger.info('[useGroupCallRoom] onCustomItemsDeleted(deletedKeys) - ', deletedKeys);
        },
      });
    }

    return () => 0;
  }, []);

  return {
    room,
    isFetched,
    currentAudioDeviceIOS,
    toggleLocalParticipantAudio,
    toggleLocalParticipantVideo,
    flipCameraFrontAndBack,
  };
};
